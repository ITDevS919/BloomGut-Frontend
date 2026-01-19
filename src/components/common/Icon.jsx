import { useCommon } from "@/hooks/useCommon";

const Icon = ({ name, size = 24, width, height, className = "", ...props }) => {
  const {
    theme: { images },
  } = useCommon();

  const SelectedIcon = images[name];

  if (!SelectedIcon) {
    console.warn(`❗ Image icon "${name}" not found in theme.images`);
    return null;
  }

  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <img
      src={SelectedIcon}
      alt={name}
      className={className}
      style={{ width: iconWidth, height: iconHeight }}
      {...props}
    />
  );
};

export default Icon;
