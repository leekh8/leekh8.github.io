import React from "react"
import styled, { keyframes } from "styled-components"

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const SkeletonBox = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.tableBackground} 25%,
    ${props => props.theme.colors.divider} 50%,
    ${props => props.theme.colors.tableBackground} 75%
  );
  background-size: 1200px 100%;
  animation: ${shimmer} 1.6s infinite linear;
  border-radius: 4px;
  height: ${props => props.$h || "16px"};
  width: ${props => props.$w || "100%"};
  margin-bottom: ${props => props.$mb || "0"};
`

const ItemWrapper = styled.div`
  padding: 20px 0 8px;
`

const SkeletonItem = () => (
  <ItemWrapper>
    <SkeletonBox $h="26px" $w="72%" $mb="14px" />
    <SkeletonBox $h="13px" $w="28%" $mb="14px" />
    <SkeletonBox $h="14px" $mb="7px" />
    <SkeletonBox $h="14px" $w="92%" $mb="7px" />
    <SkeletonBox $h="14px" $w="55%" $mb="14px" />
    <SkeletonBox $h="22px" $w="35%" />
  </ItemWrapper>
)

const SkeletonPost = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonItem key={i} />
    ))}
  </>
)

export default SkeletonPost
