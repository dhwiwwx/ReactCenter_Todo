// IssueRegister.styled.ts
import styled from "styled-components";

const priorityColors = {
  "높음": "#ef4444",
  "중간": "#f59e0b",
  "낮음": "#22c55e",
} as const;

const highlightGradients = {
  context: "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(129, 140, 248, 0.3))",
  priority: "linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(248, 113, 113, 0.28))",
  collaboration: "linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(20, 184, 166, 0.28))",
} as const;

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  padding: clamp(32px, 6vw, 72px) 16px 72px;
  background: radial-gradient(circle at top, #2c2c54 0%, rgba(28, 28, 60, 0.9) 45%, #1c1c3c 100%);
  color: #e2e8f0;
`;

export const RegisterBox = styled.div`
  position: relative;
  background-color: rgba(44, 44, 84, 0.96);
  padding: clamp(28px, 5vw, 40px);
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(4, 6, 28, 0.55);
  width: min(820px, 94vw);
  overflow: hidden;

  @media (max-width: 480px) {
    border-radius: 18px;
    padding: 24px 20px 32px;
  }
`;

export const IntroPanel = styled.section`
  position: relative;
  padding: 26px clamp(22px, 4vw, 32px);
  margin-bottom: clamp(26px, 4vw, 34px);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(99, 102, 241, 0.88));
  color: #f8fafc;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.4), transparent 45%),
      radial-gradient(circle at 80% 30%, rgba(129, 140, 248, 0.35), transparent 50%),
      radial-gradient(circle at 65% 85%, rgba(16, 185, 129, 0.4), transparent 55%);
    opacity: 0.6;
    pointer-events: none;
  }
`;

export const IntroContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const IntroTitle = styled.h2`
  margin: 0;
  font-size: clamp(20px, 4vw, 26px);
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const IntroDescription = styled.p`
  margin: 0;
  color: rgba(226, 232, 240, 0.88);
  font-size: 15px;
  line-height: 1.6;
`;

export const IntroHighlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Highlight = styled.span<{ variant: keyof typeof highlightGradients }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: ${({ variant }) => highlightGradients[variant]};
  color: #f8fafc;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  backdrop-filter: blur(6px);

  span {
    font-size: 16px;
  }
`;

export const AccentBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  pointer-events: none;
`;

export const RegisterHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: clamp(24px, 5vw, 36px);
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
`;

export const RegisterTitle = styled.h1`
  font-size: clamp(26px, 5vw, 36px);
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.3;
  margin: 0;
`;

export const RegisterSubtitle = styled.p`
  margin: 6px 0 0;
  color: #c7d2fe;
  font-size: 15px;
`;

export const ProjectBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.22);
  color: #e0e7ff;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.01em;
`;

export const MetaBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(236, 72, 153, 0.16));
  border: 1px solid rgba(148, 163, 184, 0.22);
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MetaLabel = styled.span`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #cbd5f5;
`;

export const MetaValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #f8fafc;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const PriorityBadge = styled.span<{ level: keyof typeof priorityColors }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${({ level }) => priorityColors[level]};
  color: ${({ level }) => (level === "낮음" ? "#0f172a" : "#ffffff")};
`;

export const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: rgba(79, 70, 229, 0.25);
  color: #ede9fe;
  font-weight: 600;
  font-size: 13px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: clamp(24px, 4vw, 32px);
`;

export const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  color: #f1f5f9;
  font-weight: 700;
`;

export const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
`;

export const FieldDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: #cbd5f5;
`;

export const Input = styled.input`
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background-color: rgba(31, 31, 61, 0.85);
  color: #f8fafc;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }

  &:disabled {
    background-color: rgba(51, 51, 89, 0.7);
    color: #cbd5f5;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const TextArea = styled.textarea`
  min-height: 140px;
  padding: 16px;
  font-size: 15px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background-color: rgba(31, 31, 61, 0.9);
  color: #f8fafc;
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Select = styled.select`
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background-color: rgba(31, 31, 61, 0.85);
  color: #f8fafc;
  cursor: pointer;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }
`;

export const Divider = styled.hr`
  margin: 8px 0 12px;
  border: none;
  border-top: 1px dashed rgba(148, 163, 184, 0.35);
`;

export const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TagHint = styled.span`
  font-size: 13px;
  color: #cbd5f5;
`;

export const TagInput = styled.input`
  padding: 12px 16px;
  border: 1px dashed rgba(129, 140, 248, 0.6);
  border-radius: 12px;
  background-color: rgba(31, 31, 61, 0.85);
  color: #f8fafc;
  font-size: 14px;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-style: solid;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.18);
  }

  &::placeholder {
    color: #a5b4fc;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const EmptyTag = styled.span`
  padding: 8px 12px;
  border-radius: 10px;
  background-color: rgba(99, 102, 241, 0.2);
  color: #e2e8f0;
  font-size: 13px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 9999px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 20px rgba(99, 102, 241, 0.18);
  }

  span {
    cursor: pointer;
    font-weight: 700;
    &:hover {
      color: #fde68a;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: stretch;
  }
`;

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
`;

export const FooterNote = styled.p`
  margin: 0;
  font-size: 13px;
  color: #cbd5f5;
`;

export const RegisterButton = styled.button`
  min-width: 120px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 28px rgba(99, 102, 241, 0.35);
  }

  @media (max-width: 600px) {
    flex: 1;
  }
`;

export const CancelButton = styled.button`
  min-width: 110px;
  height: 44px;
  background-color: rgba(15, 23, 42, 0.35);
  color: #e2e8f0;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
  }

  @media (max-width: 600px) {
    flex: 1;
  }
`;

export const SuggestionBox = styled.ul`
  background-color: rgba(31, 31, 61, 0.98);
  border-radius: 12px;
  margin-top: 6px;
  padding: 6px 0;
  box-shadow: 0 18px 40px rgba(4, 6, 28, 0.35);
  list-style: none;
  color: #e2e8f0;
  max-height: 180px;
  overflow-y: auto;
`;

export const SuggestionItem = styled.li`
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(99, 102, 241, 0.22);
  }
`;

export { Select as StyledSelect };
