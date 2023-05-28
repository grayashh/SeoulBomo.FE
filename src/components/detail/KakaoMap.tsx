import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function KakaoMap({
  lat,
  lng,
}: {
  lat: number | undefined;
  lng: number | undefined;
}) {
  console.log(lat, lng);
  if (lat === undefined || lng === undefined) return <></>;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Map
        className="lg:px-[19.5rem] py-[10rem]"
        center={{ lat: lat, lng: lng }}
        level={1}
      >
        <MapMarker position={{ lat: lat, lng: lng }} />
      </Map>
    </>
  );
}
