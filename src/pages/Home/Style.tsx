import styled from 'styled-components';
import card1 from '../../assets/images/homepage/page1/card1.png';
import card2 from '../../assets/images/homepage/page1/card2.png';
import card3 from '../../assets/images/homepage/page1/card3.png';
import LeftArrow from '../../assets/images/homepage/LeftArrow.png';
import RightArrow from '../../assets/images/homepage/RightArrow.png';

export const OpacityGradient = styled.div`
  position: absolute;
  z-index: 50;
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(10, 10, 10, 1));
  opacity: 0;
  transition: opacity 1s;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    opacity: 1
  `};
`;

export const LeftContentWrapper = styled.div`
  position: relative;
  left: -80px;
  z-index: 100;
  padding: clamp(100px, 15vw, 200px) 10px clamp(160px, 20vw, 350px) 10px;
  transition: transform 1s, width 1s;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    transform: translateY(150px);
    left:0;
  `}
`;

export const HeroTitle = styled.h1`
  font-family: 'Scto Grotesk A';
  font-weight: normal;
  font-size: clamp(26px, 6.5vw, 40px);
  line-height: 125%;
  min-width: 260px;
  max-width: 550px;
  margin-bottom: 50px;
`;

export const BookNow = styled.h3`
  font-size: clamp(14px, 2vw, 16px);
  font-family: 'Eina01-Light';
  font-weight: 700;
  background-color: ${(props) => props.color};
  border-radius: 40px;
  padding: 13px 40px 17px 40px;
  width: fit-content;
`;

export const CreatorText = styled.div`
  z-index: 10;
  max-width: 500px;
  right: 5%;
  position: absolute;
  top: 270px;
  padding: 5px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: 70px;
    left: 5%;
  `}
`;

export const Name = styled.div`
  z-index: 10;
  font-size: 24px;
  font-family: 'Eina01';
  font-weight: 700;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 20px;
  `}
`;
export const Title = styled.div`
  font-family: 'Eina01-Light';
  font-size: 24px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 20px;
  `}
`;
export const Left = styled.button`
  position: absolute;
  left: clamp(0px, 4% - 8px, 50px);
  top: 400px;
  background-image: url(${LeftArrow});
  background-size: cover;
  background-color: transparent;
  border: none;
  height: 30px;
  width: 17px;
  z-index: 10;
  opacity: 1;
  transition: opacity 1s;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    opacity: 0;
    pointer-events: none;
  `}
`;
export const Right = styled.button`
  position: absolute;
  right: clamp(0px, 4% - 8px, 50px);
  top: 400px;
  background-image: url(${RightArrow});
  background-size: cover;
  background-color: transparent;
  border: none;
  height: 30px;
  width: 17px;
  z-index: 10;
  opacity: 1;
  transition: opacity 1s;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    opacity: 0;
    pointer-events: none;
  `}
`;

export const Ovals = styled.div`
  display: flex;
  flex-direction: row;
`;
interface OvalProps {
  index: number;
  page: number;
}
export const Oval = styled.div<OvalProps>`
  background-color: ${(props) => (props.index == props.page ? props.theme.twitterBlue : '#6F6F6F')};
  width: 25px;
  height: 5px;
  border-radius: 10px;
  margin: 0 5px 0 5px;
  opacity: 0;
  transition: opacity 1s;
  pointer-events: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    opacity: 1;
    pointer-events: revert;
  `}
`;
