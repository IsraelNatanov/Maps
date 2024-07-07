import { configureStore } from "@reduxjs/toolkit";
import { eventsSlice } from "./features/eventFeaturesSlice";

export const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,

  },
});
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// export type RootState = ReturnType<typeof store.getState>;
// export const useAppDispatch: () => typeof store.dispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;