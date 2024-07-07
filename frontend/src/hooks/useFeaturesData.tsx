import { useQuery, useMutation, useQueryClient, UseQueryResult } from 'react-query';
import {  request } from '../utils/axios-utils';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import { FeaturesOfList, IFeatureCollection, IFeatures } from '../typs/featuresType';
import { AxiosError } from 'axios';
import { toastMessage } from '../utils/toastMessage';


const fetchData = <T,>(featureType: string): Promise<T> => {
  return request({ url: `/${featureType}` }).then(response => response.data);
};

// Generic useGetFeaturesData hook
export const useGetFeaturesData = <T,>(
  featureType: string,
  onSuccess?: (data: T) => void,
  onError?: (error: unknown) => void
): UseQueryResult<T> => {
  return useQuery<T>([featureType], () => fetchData<T>(featureType), {
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

// Specific hooks using the generic hook
export const useGetFeatureCollectionData = (
  featureType: string,
  onSuccess?: (data: IFeatureCollection) => void,
  onError?: (error: unknown) => void
): UseQueryResult<IFeatureCollection> => {
  return useGetFeaturesData<IFeatureCollection>(featureType, onSuccess, onError);
};

export const useGetEventsData = (
  featureType: string,
  onSuccess?: (data: FeaturesOfList[]) => void,
  onError?: (error: unknown) => void
): UseQueryResult<FeaturesOfList[]> => {
  return useGetFeaturesData<FeaturesOfList[]>(featureType, onSuccess, onError);
};

export type AddFeatureParams = {
  feature: IFeatures
  layer: string;
};


interface UseAddFeatureResult {
  mutate: (params: AddFeatureParams) => void;
  isLoading: boolean;
  isError: boolean;
  error: any;

}

export const useAddFeature = (vectorLayers: { [key: string]: VectorLayer<VectorSource<Geometry>> }): UseAddFeatureResult => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({ feature, layer }: AddFeatureParams) => {
  
      console.log(feature, layer);
      const response = await request({ url: `/${layer}`, method: 'post', data: feature });
      return response.data;
    },
    {
      onSuccess: (data, { feature, layer }) => {

        queryClient.setQueryData<IFeatureCollection>(layer, (oldQueryData) => {
          if (!oldQueryData) {
            return { type: 'FeatureCollection', features: [feature] };
          }
          return { type: 'FeatureCollection', features: [...oldQueryData.features, feature] };
        });
  
        toastMessage(true)

      },
      onError: (error: AxiosError, { layer }) => {
        console.error("Mutation error occurred:", error);
        queryClient.invalidateQueries(layer);
        toastMessage(false)
      }
    }
  );
  return {
    ...mutation,
  
  };
};

interface DeleteFeatureParams {
  layer: string;
  idFeature: string;
}

interface UseDeleteFeatureResult {
  mutate: (params: DeleteFeatureParams) => void;
  error: any;

}

export const useDeleteFeature = (vectorLayers: { [key: string]: VectorLayer<VectorSource> }): UseDeleteFeatureResult => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({ layer, idFeature }: DeleteFeatureParams) => {
    
      const response = await request({ url: `/${layer}/${idFeature}`, method: 'delete' });
      return response.data;
    },
    {
      onMutate: async ({ layer, idFeature }: DeleteFeatureParams) => {
        await queryClient.cancelQueries(layer);
     
        const previousFeatures = queryClient.getQueryData<IFeatureCollection>(layer);

        queryClient.setQueryData<IFeatureCollection>(layer, oldQueryData => {
          if (!oldQueryData) return { type: 'FeatureCollection', features: [] };
          const updatedFeatures = oldQueryData.features.filter(item => item.id !== idFeature);
          return { type: 'FeatureCollection', features: updatedFeatures };
        });

        return { previousFeatures, layer, idFeature };
      },
      onError: (error, _newFeature, context: any) => {
        if (context?.previousFeatures) {
          queryClient.setQueryData(context.layer, context.previousFeatures);
        }
        toastMessage(false)
        console.error("Mutation error occurred:", error);
      },
 
      onSuccess: () => {
        toastMessage(true)
      },
      onSettled: (_, __, { layer }) => {
        queryClient.invalidateQueries(layer);
       
      },
    }
  );

  return {
    mutate: mutation.mutate,
    error: mutation.error,
  
  };
};

