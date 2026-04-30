import IButton from "@/components/custom/Button";
import Paragraph from "@/components/custom/Paragraph";
import {
  useActiveDiscountsQuery,
  useAvailableMenuItemsQuery,
  useCategoriesQuery,
  useEmployeesQuery,
} from "@/queries/useTakeOrderQueries";
import { extractErrorMessage } from "@/shared/helpers/extractErrorMessage";

export default function TakeOrderLoadStatus() {
  const employeesQuery = useEmployeesQuery();
  const categoriesQuery = useCategoriesQuery();
  const menuItemsQuery = useAvailableMenuItemsQuery();
  const discountsQuery = useActiveDiscountsQuery();
  const isLoading =
    employeesQuery.isLoading ||
    categoriesQuery.isLoading ||
    menuItemsQuery.isLoading ||
    discountsQuery.isLoading;
  const hasError =
    employeesQuery.isError ||
    categoriesQuery.isError ||
    menuItemsQuery.isError ||
    discountsQuery.isError;
  const errorMessage =
    extractErrorMessage(discountsQuery.error, "") ||
    extractErrorMessage(menuItemsQuery.error, "") ||
    extractErrorMessage(employeesQuery.error, "") ||
    extractErrorMessage(categoriesQuery.error, "Unable to load ordering data.");

  if (isLoading) {
    return (
      <Paragraph size="sm" className="mt-4 text-gray-500">
        Loading employees, categories, menu items, and discounts...
      </Paragraph>
    );
  }

  if (!hasError) return null;

  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
      <Paragraph size="sm" className="text-red-600">
        {errorMessage}
      </Paragraph>
      <div className="mt-2 flex flex-wrap gap-2">
        <IButton
          type="button"
          variant="outline"
          showLoading={false}
          onClick={() => employeesQuery.refetch()}
        >
          Retry employees
        </IButton>
        <IButton
          type="button"
          variant="outline"
          showLoading={false}
          onClick={() => discountsQuery.refetch()}
        >
          Retry discounts
        </IButton>
        <IButton
          type="button"
          variant="outline"
          showLoading={false}
          onClick={() => categoriesQuery.refetch()}
        >
          Retry categories
        </IButton>
        <IButton
          type="button"
          variant="outline"
          showLoading={false}
          onClick={() => menuItemsQuery.refetch()}
        >
          Retry menu items
        </IButton>
      </div>
    </div>
  );
}
