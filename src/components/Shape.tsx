export default function Shape({
    width = 100,
    height = 100,
    fillColor = "#5A5A5A",
    opacity = 0.7,
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 100 100"
        >
            <path
                d="M20 10
           C50 40, 70 60, 80 90
           Q50 70, 20 50
           C10 30, 15 20, 20 10 Z"
                fill={fillColor}
                fillOpacity={opacity}
            />
        </svg>
    );
}
