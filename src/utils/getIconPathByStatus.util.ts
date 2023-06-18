import WPStatus from "../infrastructure/openProject/wpStatus.enum";

export default function getIconPathByStatus(
  status?: WPStatus,
): string | undefined {
  switch (status) {
    case WPStatus.confirmed:
      return "resources/confirmed.png";
    case WPStatus.inSpecification:
      return "resources/in_specification.png";
    case WPStatus.specified:
      return "resources/specified.png";
    case WPStatus.inProgress:
      return "resources/developing.png";
    case WPStatus.developed:
      return "resources/developed.png";
    case WPStatus.inTesting:
      return "resources/testing.png";
    case WPStatus.tested:
      return "resources/tested.png";
    case WPStatus.testFailed:
      return "resources/failed.png";
    case WPStatus.onHold:
      return "resources/hold.png";
    case WPStatus.closed:
      return "resources/closed.png";
    case WPStatus.rejected:
      return "resources/rejected.png";
    default:
      return undefined;
  }
}
