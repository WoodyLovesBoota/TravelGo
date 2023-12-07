import styled from "styled-components";
const StarRate = ({ dataRating, size }: { dataRating: number | undefined; size: string }) => {
  return (
    <StarRateWrap>
      {["one", "two", "three", "four", "five"].map((count, index) => {
        let rate = dataRating ? Math.floor(dataRating * 10) : 0;
        let list = [];
        while (rate > 0) {
          if (rate >= 10) {
            list.push(14);
            rate -= 10;
          } else {
            list.push((14 * rate) / 10);
            rate = 0;
          }
        }
        return (
          <span key={dataRating + count}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 13" fill="#cacaca">
              <clipPath id={`${dataRating}${count}StarClip`}>
                <rect width={`${list[index] ? list[index] : 0}`} height="20" />
              </clipPath>
              <path
                id={`${dataRating}${count}Star`}
                d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
                transform="translate(-2 -2)"
              />
              <use
                clipPath={`url(#${dataRating}${count}StarClip)`}
                href={`#${dataRating}${count}Star`}
                fill="#ffba08"
              />
            </svg>
          </span>
        );
      })}
    </StarRateWrap>
  );
};

export default StarRate;

const StarRateWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  margin: 0;
  span {
    display: inline-block;
    margin-right: 3px;
  }
`;
