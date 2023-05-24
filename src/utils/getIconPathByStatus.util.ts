export default function getIconPathByStatus(
  status?: string,
): string | undefined {
  switch (status) {
    case "Confirmed":
      return "resources/confirmed.png";
    case "In specification":
      return "resources/in_specification.png";
    case "Specified":
      return "resources/specified.png";
    case "In progress":
      return "resources/developing.png";
    case "Developed":
      return "resources/developed.png";
    case "In testing":
      return "resources/testing.png";
    case "Tested":
      return "resources/tested.png";
    case "Test failed":
      return "resources/failed.png";
    case "On hold":
      return "resources/hold.png";
    case "Closed":
      return "resources/closed.png";
    case "Rejected":
      return "resources/rejected.png";
    default:
      return undefined;
  }
}
