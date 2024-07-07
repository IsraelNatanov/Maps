const mongoose = require('mongoose');

type PrayerTimesType = {
    civilDate: string;
    jewishDate: string;
    dayOfWeek: string;
    parshasHashavua: string;
    alos16_1: string;
    alos72Minutes: string;
    misheyakir10_2: string;
    sunrise20_57Meters: string;
    sunriseSeaLevel: string;
    sofZmanShmaMGA72Minutes: string;
    sofZmanShmaGRA: string;
    sofZmanTfilaMGA72Minutes: string;
    sofZmanTfilaGRA: string;
    chatzosAstronomical: string;
    minchaGedolaGRA: string;
    plagHamincha: string;
    candleLighting18Minutes: string;
    sunsetSeaLevel: string;
    sunset20_57Meters: string;
    tzaisGeonim8_5: string;
    tzais72Minutes: string;
    tzais16_1: string;
};

const prayerTimesSchema = new mongoose.Schema({
    civilDate: String,
    jewishDate: String,
    dayOfWeek: String,
    parshasHashavua: String,
    alos16_1: String,
    alos72Minutes: String,
    misheyakir10_2: String,
    sunrise20_57Meters: String,
    sunriseSeaLevel: String,
    sofZmanShmaMGA72Minutes: String,
    sofZmanShmaGRA: String,
    sofZmanTfilaMGA72Minutes: String,
    sofZmanTfilaGRA: String,
    chatzosAstronomical: String,
    minchaGedolaGRA: String,
    plagHamincha: String,
    candleLighting18Minutes: String,
    sunsetSeaLevel: String,
    sunset20_57Meters: String,
    tzaisGeonim8_5: String,
    tzais72Minutes: String,
    tzais16_1: String,
});

export const PrayerTimesModel = mongoose.model('PrayerTimes', prayerTimesSchema);

