import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  padding: clamp(20px, 5vw, 32px);
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: #ffffff;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: clamp(22px, 3vw, 26px);
  font-weight: 700;
`;

export const DashboardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`;

export const DashboardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #cfd4ff;
`;

export const DashboardTitle = styled.h3`
  font-size: clamp(20px, 2.6vw, 24px);
  font-weight: 600;
  margin: 0;
  color: #ffffff;
`;

export const DashboardSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #aab0d6;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

export const MetricCard = styled.div`
  background: linear-gradient(145deg, rgba(67, 76, 204, 0.35), rgba(25, 27, 57, 0.6));
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
`;

export const MetricLabel = styled.span`
  font-size: 13px;
  color: #adb5ff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const MetricValue = styled.strong`
  font-size: clamp(22px, 3vw, 30px);
  color: #ffffff;
  font-weight: 700;
`;

export const MetricCaption = styled.span`
  font-size: 12px;
  color: #9ba3d4;
`;

export const DashboardSplit = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
`;

export const TrendCard = styled.div`
  background-color: rgba(29, 31, 68, 0.9);
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
`;

export const TrendTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

export const TrendList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TrendItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TrendLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #d0d4ff;
  font-size: 13px;
`;

export const TrendBar = styled.span<{ width: number }>`
  display: block;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, #7b6cff);
  width: ${({ width }) => Math.max(6, width)}%;
  transition: width 0.3s ease;
`;

export const ActivityList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ActivityItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: rgba(60, 64, 115, 0.45);
  border: 1px solid rgba(123, 130, 200, 0.2);
`;

export const ActivityTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

export const ActivityMeta = styled.span`
  font-size: 12px;
  color: #9da3d9;
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
  animation: ${fadeIn} 0.3s ease;
`;

export const CardGrid = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  animation: ${fadeIn} 0.3s ease;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
`;

export const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ProjectInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  font-size: 15px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 8px;

  &::placeholder {
    color: #aaa;
  }
`;

export const DescriptionInput = styled(ProjectInput)`
  flex: 2;
`;

export const AddButton = styled.button`
  padding: 10px 14px;
  font-size: 15px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ToggleButton = styled.button`
  padding: 10px 14px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryHover};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ProjectItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 10px;
  margin-bottom: 14px;
  font-size: 16px;
  animation: ${fadeIn} 0.3s ease;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  span {
    cursor: pointer;
    color: #ffffff;

    &:hover {
      text-decoration: underline;
    }
  }

  &:hover {
    background-color: #3b3e7a;
    transform: scale(1.01);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
`;

export const CardItem = styled.li`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 10px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease;

  &:hover {
    background-color: #3b3e7a;
    transform: scale(1.01);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

export const PinButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

export const RecentBadge = styled.span`
  background-color: #ff9800;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  margin-left: 8px;
`;

export const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 8px;
`;

export const ProgressBackground = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.inputBorder};
  height: 6px;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ percent: number }>`
  height: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${(props) => props.percent}%;
`;

export const EditInput = styled.input`
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

export const SearchButton = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

export const StyledLogoutButton = styled.button`
  padding: 10px 14px;
  background-color: ${({ theme }) => theme.colors.logoutBg};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.logoutHover};
  }

  @media (max-width: 900px) {
    flex: 1;
  }
`;

export const ViewToggleButton = styled.button`
  padding: 10px 14px;
  background-color: ${({ theme }) => theme.colors.viewToggleBg};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.viewToggleHover};
  }

  @media (max-width: 900px) {
    flex: 1;
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
`;

export const PinnedBar = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.pinnedBarBg};
  padding: 10px;
  z-index: 1;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  font-size: 14px;
  font-weight: bold;
`;

export const ProjectCount = styled.span`
  font-size: 16px;
  margin-left: 8px;
  color: #aaa;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
`;
