"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ContentCard from "./ContentCard";
import { Tab } from "@headlessui/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Review from "./Review";
import KakaoMap from "./KakaoMap";
import { useRecoilValue } from "recoil";
import { isLoginSelector, userAtom } from "@/state";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DetailFrame() {
  const router = useRouter();

  const pathname = usePathname();
  const params = useParams();

  // invalidateQueries를 사용하여 쿼리를 무효화 시키고 다시 호출하기 위해 queryClient를 사용합니다.
  const queryClient = useQueryClient();

  const user = useRecoilValue(userAtom);
  const isLogin = useRecoilValue(isLoginSelector);

  const getDetailData = async () => {
    if (`/center/${params.id}` === pathname) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/child-center-info/${params.id}`
      );
      return data;
    } else {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/child-care-info/${params.id}`
      );
      return data;
    }
  };

  const { isLoading, isError, data, error } = useQuery(
    ["detail"],
    getDetailData,
    {
      refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
      retry: 0, // 실패시 재호출 몇번 할지
      onSuccess: (data: IDetailData) => {
        // 성공시 호출
      },
      onError: ({ e }: any) => {},
    }
  );

  // 스크랩 버튼 클릭시
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    postScrapMutate();
  };

  //2. 토큰 보내서 사용자 정보 받기(from Backend)
  const postScrap = async () => {
    if (pathname.search("care") === 1) {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/care-info`, {
          userId: user?.id,
          careInfoId: params.id,
        })
        .then((res) => {
          alert(res.data);
        });
    } else {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/center-info`, {
          userId: user?.id,
          centerId: params.id,
        })
        .then((res) => {
          alert(res.data);
        });
    }
  };

  const {
    mutate: postScrapMutate,
    isLoading: postScrapIsLoding,
    isError: postScrapIsError,
  } = useMutation(["postScrap"], postScrap, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
    },
    onError: (error: any) => {
      alert("알 수 없는 오류입니다.");
      router.push(pathname);
    },
  });

  if (isLoading || postScrapIsLoding) {
    return <></>;
  }

  return (
    <main className="flex flex-col w-screen justify-start items-center">
      {/* Wrapper */}
      <section className="flex flex-col-reverse lg:flex-row lg:items-start justify-center gap-[1rem] p-[1rem]">
        <KakaoMap
          lat={data === undefined ? 33.5563 : Number.parseFloat(data?.latitude)}
          lng={
            data === undefined ? 126.795841 : Number.parseFloat(data?.longitude)
          }
        />
        <div className="flex lg:flex-col justify-center items-center gap-[1rem] lg:pt-[3rem]">
          <div className="rounded=[0.625rem] lg:px-[4rem] px-[2rem] h-[5rem] bg-amber-200 shadow-md flex items-center font-bold text-base md:text-xl lg:text-2xl mb-[1rem] rounded-[0.625rem] whitespace-nowrap">
            {data?.name}
          </div>
          <form onSubmit={submitForm}>
            <label className="cursor-pointer">
              <button type="submit" className="peer hidden" />
              <div className="p-[0.7rem] gap-[0.4rem] bg-amber-200/30 rounded=[0.625rem] bg-white-300 text-gray-600 flex justify-start items-center font-bold text-xl rounded-md shadow-lg hover:bg-amber-200 ease-in-out duration-300 peer-checked:bg-yellow-200 peer-checked:text-black peer-checked:ring-yellow-400 peer-checked:ring-offset-2 ring-2 ring-transparent">
                <div className="lg:text-gray-600 lg:font-medium lg:text-base lg:block hidden">
                  {data?.likeCount}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#f59e0b"
                    d="m37 43l-13-6l-13 6V9c0-2.2 1.8-4 4-4h18c2.2 0 4 1.8 4 4v34z"
                  />
                </svg>
              </div>
            </label>
          </form>
        </div>
      </section>
      {/* 개요 및 리뷰 */}
      <div className="bg-white shadow-md w-[20rem] sm:w-[30rem] md:w-[40rem] lg:w-[60rem] drop-shadow-[0_1.5rem__1.5rem_rgba(0,0,0,0.05)] mb-[2rem] rounded-[1rem] flex flex-col justify-start gap-[1rem]">
        <div className="flex flex-col">
          <Tab.Group>
            <Tab.List className="bg-yellowColor flex rounded-xl p-4 border-b-2 border-transparent rounded-t-lg text-lg hover:text-gray-600 hover:border-gray-30">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-yellow-400 focus:outline-none focus:ring-2",
                    selected
                      ? "text-gray-900 bg-white shadow-md"
                      : "text-gray-400 hover:bg-white/[0.2] hover:text-gray-800"
                  )
                }
              >
                개요
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-yellow-400 focus:outline-none focus:ring-2",
                    selected
                      ? "text-gray-900 bg-white shadow-md"
                      : "text-gray-400 hover:bg-white/[0.2] hover:text-gray-800"
                  )
                }
              >
                리뷰
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
                <div className="flex flex-col gap-[1rem]">
                  <div className="flex gap-[1rem]">
                    {data?.preschoolType !== undefined && (
                      <ContentCard
                        type="kindergarten"
                        content={
                          data?.preschoolType === "PUBLIC" ? "국공립" : "사립"
                        }
                      />
                    )}
                    {data?.isFree !== undefined && (
                      <ContentCard
                        type="isFree"
                        content={data?.isFree ? "무료" : "유료"}
                      />
                    )}
                    {data?.cctvNum !== undefined && (
                      <ContentCard
                        type="cctv"
                        content={"CCTV " + data?.cctvNum + "개"}
                      />
                    )}
                    {data?.playgroundNum !== undefined && (
                      <ContentCard
                        type="playground"
                        content={"놀이터 " + data?.playgroundNum + "개"}
                      />
                    )}
                    {data?.isSchoolBus !== undefined && (
                      <ContentCard
                        type="bus"
                        content={
                          data?.isSchoolBus
                            ? "통학 차량 있음"
                            : "통학 차량 없음"
                        }
                      />
                    )}
                    {data?.isSatOpen !== undefined && (
                      <ContentCard
                        type="calender"
                        content={
                          data?.isSatOpen ? "토요일 운영" : "토요일 미운영"
                        }
                      />
                    )}
                    {data?.ageType !== undefined && (
                      <ContentCard type="ageType" content={data?.ageType} />
                    )}
                  </div>
                  <div className="text-lg lg:text-xl font-semibold leading-[3rem] lg:leading-[4rem] border-l-4 border-yellow-200 pl-[1rem]">
                    {data?.address}
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
                <Review />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </main>
  );
}
// 보육 정보 상세 조회 GET api/v1/child-care-info/{child-care-info-id}
// {
//     "id": 1,
//     "name": "금천 하모니 축제",
//     "infoType": "문화행사",
//     "borough": "금천구",
//     "ageType": "연령무관",
//     "latitude": "126.89604",
//     "longitude": "37.45707",
//     "address": "서울특별시 금천구 시흥대로73길 70금천구청 앞 중앙무대 (시흥동)",
//     "isFree": true,
//     "fee": "",
//     "startAt": "2023-05-13",
//     "endAt": "2023-05-14",
//     "infoUrl": "",
//     "facilityName": "EVENT_FCLTY_NM",
//     "reviewCount": 0,
//     "likeCount": 0
// }
// 또는
// 아동 센터 정보 상세조회 GET /api/v1/child-center-info/{child-center-info-id}
//  {
// "id": 3,
// "name": "별숲어린이집",
// "centerType": "어린이집",
// "borough": "구로구",
// "address": "서울특별시 구로구 경인로43길 49 고척아이파크MD 내 관리실",
// "preschoolType": "국공립",
// "contactNumber": null,
// "homepage": null,
// "classNum": null,
// "playgroundNum": 3,
// "cctvNum": 0,
// "teacherNum": 0,
// "latitude": 37.56647,
// "longitude": 126.977963,
// "isSchoolBus": false,
// "isFree": false,
// "fee": "0",
// "isSatOpen": false,
// "serviceType": "야간연장",
// "reviewCount": 0,
// "likeCount": 0
// }
// 위 두가지 형태로 데이터가 들어옵니다. 각각 타입을 만들어서 합쳐 처리해줍니다.
// 공통된 프로퍼티는 id, name, borough, latitude, longitude, address, isFree, reviewCount, likeCount 입니다.

//  두 타입을 합쳐서 서로 공통된 프로퍼티는 그대로 두고 나머지는 선택적으로 처리하여 어떤 타입이 들어오던지 처리할 수 있도록 합니다.
// Intersection Type
type IDetailData = IChildCareData & IChildCenterData;
interface IChildCareData {
  id: number;
  name: string;
  borough: string;
  latitude: string;
  longitude: string;
  address: string;
  isFree: boolean;
  reviewCount: number;
  likeCount: number;
  infoType: string;
  ageType: string;
  fee: string;
  startAt: string;
  endAt: string;
  infoUrl: string;
  facilityName: string;
}

interface IChildCenterData {
  id: number;
  name: string;
  borough: string;
  latitude: string;
  longitude: string;
  address: string;
  isFree: boolean;
  reviewCount: number;
  likeCount: number;
  centerType: string;
  preschoolType: string;
  contactNumber: string;
  homepage: string;
  classNum: number;
  playgroundNum: number;
  cctvNum: number;
  teacherNum: number;
  isSchoolBus: boolean;
  fee: string;
  isSatOpen: boolean;
  serviceType: string;
}
