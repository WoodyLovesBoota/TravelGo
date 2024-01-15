# TravelGo

![Project ScreenShot0](https://firebasestorage.googleapis.com/v0/b/travelgo-6fa6a.appspot.com/o/Travelgo%2Ftravelgo%2001.webp?alt=media&token=f892f767-8833-4c2b-95be-048db9324ed8)
<br>
<br>

## TravelGo는?

TravelGo는 여행을 쉽게 계획할 수 있도록 돕는 여행 스케줄링 서비스 입니다. 여행 계획을 세우는 데 어려움을 겪는 여행자들이 빠르고 효율적으로 계획을 세울 수 있도록 지원하며, 간편한 동선 계획 기능과 직관적인 인터페이스를 통해 사용자들의 여행 준비 시간을 줄이는 것을 목표로 개발하였습니다. <br>

직관적인 사용자 인터페이스를 구현하기 위해 장소 검색 기능과 지도 표시 기능을 통합하여 레이아웃을 일체화 하였습니다. 사용자가 원하는 장소를 검색하면, 이미 선택된 장소와 함께 검색 결과가 지도에 표시되어 대략적인 동선을 설계할 수 있습니다.<br>

또한 여행 동선을 쉽게 설계하기 위해 드래그 앤 드롭 기능을 활용하였습니다. 이를 통해 장소들의 순서를 쉽게 변경하여 실시간으로 업데이트 되는 지도를 통해 최적의 여행 경로를 시각적으로 확인할 수있습니다.<br>

프로젝트에서 구현한 핵심 기능은 장소 검색, 실시간 구글 지도 연동, 드래그 앤 드롭을 이용한 여행 동선 설계 입니다.
<br>
<br>

## 배포 링크

[https://main--soft-taffy-a6cbf8.netlify.app/](https://main--soft-taffy-a6cbf8.netlify.app/)

<br>
<br>

## 기술 스택

- `Typescript`, `React`
- `Axios`, `React Query`, `Recoil`, `React Beautiful Dnd`
- `Prettier`, `Netlify`, `Google Maps API`
<br>
<br>

## 개발 기간

- 2023년 10월 - 2023년 12월
<br>
<br>

## 기능 구현

### Google Maps API와 React Query를 활용한 장소 검색 기능 구현<br>
![Project ScreenShot2](https://firebasestorage.googleapis.com/v0/b/travelgo-6fa6a.appspot.com/o/Travelgo%2F1704356341102.webp?alt=media&token=eae48438-1175-45bc-9563-a0f0b5365f6f)

Google Maps API의 Place Autocomplete API를 활용하여 장소 검색 기능을 구현하였습니다. 이를 통해 입력한 키워드에 따른 관광지 및 숙소 검색 결과를 최대 5개까지 확인할 수 있습니다. 또한, Place Detail API를 통해 원하는 장소를 선택하여 해당 장소의 리뷰, 별점, 간단한 설명 등 세부 정보를 확인할 수 있도록 하였습니다.<br>

React 컴포넌트에서 API를 호출하는 방법은 크게 useEffect 와 React Query 두가지가 있습니다. 검색 과정에서 로딩, 성공, 에러 등 데이터 fetching에 대한 상태 관리 기능이 필요했기 때문에 TravelGo 프로젝트에서는 이를 지원하는 React Query를 사용하기로 결정했습니다.<br>

React Query의 캐싱 기능을 통해 서버 부담을 줄이고 데이터 로딩 속도를 개선하여 사용자 경험을 향상시켰으며, useEffect를 사용하는 방법에 비해 구현과정에서 상태 관리 로직을 별도로 작성할 필요가 없어 개발 과정을 효율적으로 만들 수 있었습니다.<br>
<br>


### 실시간 지도 업데이트 기능 구현<br>

직관적인 사용자 인터페이스를 제공하기 위해 다양한 상황에서 지도를 표시할 필요가 있었습니다. 사용자가 장소를 검색할 때 검색 결과를 지도에 표시하는 기능이 있어야 했고, 여행 동선을 계획할 때는 드래그 앤 드롭 기능에 따라 변경된 경로를 지도상에 보여주어야 했습니다.<br>

구글 지도를 화면에 표시하는 방법은 크게 iframe을 통한 방식과 react google maps 라이브러리를 사용하는 방식 두 가지가 있습니다. iframe을 사용하는 방법은 구현 난이도가 낮다는 장점이 있었지만, 기본적인 기능만 제공 하였기에 원하는 위치에 마커를 표시하는 기능 등 필요한 기능을 구현할 수 없었습니다. 반면, react google maps 라이브러리는 구현 난이도가 있다는 단점이 있었지만, 마커 설정, 다중 경로 표시, 지도 스타일링을 위한 커스텀 오버레이 기능 등을 이용할 수 있었습니다. 저는 기획 단계에서 만들기로 한 기능을 구현하기 위해 react google maps 라이브러리를 통해 화면에 지도를 표시하였습니다.<br>
<br>


### 드래그 앤 드롭을 통한 효율적인 동선 설계방식 구현<br>
![Project ScreenShot3](https://firebasestorage.googleapis.com/v0/b/travelgo-6fa6a.appspot.com/o/Travelgo%2F1704356386916.webp?alt=media&token=4c482948-45ca-4c91-9433-3cc84538cb31)

간단한 애니메이션을 제공하는 react beautiful dnd 라이브러리를 활용하여 드래그 앤 드롭 기능을 구현 하였고, 구글 지도와 연계하여 사용자들이 여행 동선을 직접 설계할 수 있도록 하였습니다. 이 기능을 통해 사용자들은 장소를 원하는 곳에 직관적으로 배치할 수 있으며, 장소를 추가하거나 순서를 변경할 때마다 지도 상에서의 경로 변화를 쉽게 파악할 수 있어 효율적으로 여행 계획을 설계할수 있습니다.<br>

장소에 대한 정보는 배열을 이용해 관리 하였으며, 드래그 앤 드롭이 유효하게 수행될 때 마다 splice 메서드를 사용하여 장소를 추가하거나 삭제하였습니다.<br>
<br>


### Recoil과 로컬 스토리지를 활용한 효율적인 상태 관리 및 데이터 보존<br>

전역 상태관리 라이브러리인 Recoil을 이용하여 애플리케이션 전반에 걸쳐 상태 변수를 관리하였습니다. 이를 통해 컴포넌트 간의 불필요한 props 전달을 방지하고, 각 컴포넌트에서 필요한 상태만 사용하게하여 상태 관리의 복잡성을 크게 줄였습니다.
이와 더불어, Recoil의 effects 속성을 이용하여 전역 상태와 브라우저의 로컬 스토리지를 연동하였습니다. 이를 통해 사용자의 여행 정보를 안정적으로 저장하고 유지하여 사용자가 애플리케이션을 재방문할 때 여행 정보를 쉽게 복원할 수 있도록 해주어 사용자 경험을 개선하였습니다.
<br>
<br>
## 문제 해결

### API 호출 최적화를 통한 로딩 속도 개선<br>

장소 검색 과정 중, 동시에 이루어지는 다수의 API 호출로 인한 로딩 속도 저하 문제가 발생하였습니다. 검색 결과를 표시하고, 각 검색 결과에 대한 세부 정보를 불러오며, 이를 지도에 표시하는 등 총 7-8개의 API가 한번에 호출되는 과정에서 브라우저의 로딩 시간이 현저히 길어졌습니다.<br>
문제를 해결하기 위해, API 호출을 비동기적으로 처리하는 방식을 이용하였습니다. React Query의 enabled 속성을 활용하여 API 호출을 특정 상태에 따라 조절함으로써, 필요한 시점에만 fetch된 데이터를 사용하도록 구현했습니다. 구체적으로, 7개의 API를 두 단계로 나누어 장소의 세부 사항을 불러오는 API는 사용자가 검색 결과를 선택하기 전까지 호출되지 않더라도 사용자 경험에 문제가 발생하지 않도록 구현하였습니다. 이 방법을 통해 불필요한 API call을 방지하였고, 로딩 시간을 50% 이상 줄였습니다.

### 사용자 경험 개선을 위한 인터페이스 최적화<br>
드래그 앤 드롭 기능을 구현하는 과정에서 렌더링 시간이 길어져 사용자 경험에 부정적인 영향을 주는 문제가 발생하였습니다. 사용자가 드래그 할 카드에 사진, SVG 등 로딩이 필요한 요소가 포함되어 있어, 순서를 변경할 때마다 브라우저가 잠깐씩 멈추는 현상이 발생했습니다.<br>
데이터 자체는 전부 string으로 되어있었기 때문에 드래그 앤 드롭 과정에서 데이터가 옮겨지는 것에서 오는 문제보다는 새로운 영역에서 카드를 다시 렌더링 하는 과정에서 발생하는 문제라고 생각했습니다. 카드에서 이미지, SVG, 장소 세부 정보와 같이 렌더링에 부담을 주는 요소들을 과감히 정리하는 방법을 사용하였더니 예상대로 브라우저 멈춤 현상이 없어져 문제를 해결할 수 있었습니다.<br>
비록 기술적인 발전을 통한 해결 방법은 아니었지만, 이 과정을 통해 사용자 인터페이스 디자인과 프로그램 성능 사이의 균형을 맞추는 중요한 경험을 하였습니다. 이를 통해 어떤 정보가 사용자에게 가장 필요한지에 대한 우선순위를 고민하는 기회가 되었습니다.

  
<br><br>

**여행 목적지 및 날짜 설정**
<br>

![Project ScreenShot1](https://firebasestorage.googleapis.com/v0/b/travelgo-6fa6a.appspot.com/o/Travelgo%2F1704356535803.webp?alt=media&token=de4efa01-8427-477e-b0f3-5feb43b76878)
<br>
![Project ScreenShot1](https://firebasestorage.googleapis.com/v0/b/travelgo-6fa6a.appspot.com/o/Travelgo%2Ftravelgo%2003.webp?alt=media&token=5993404b-9abf-428c-aefb-f220d2b27531)
