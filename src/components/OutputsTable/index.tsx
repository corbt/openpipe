import { Button, Grid, GridItem, HStack, Heading, type SystemStyleObject } from "@chakra-ui/react";
import { api } from "~/utils/api";
import NewScenarioButton from "./NewScenarioButton";
import NewVariantButton from "./NewVariantButton";
import ScenarioRow from "./ScenarioRow";
import VariantEditor from "./VariantEditor";
import VariantHeader from "./VariantHeader";
import { cellPadding } from "../constants";
import { BsPencil } from "react-icons/bs";
import VariantStats from "./VariantStats";
import { useAppStore } from "~/state/store";

const stickyHeaderStyle: SystemStyleObject = {
  position: "sticky",
  top: "-1px",
  backgroundColor: "#fff",
  zIndex: 1,
};

export default function OutputsTable({ experimentId }: { experimentId: string | undefined }) {
  const variants = api.promptVariants.list.useQuery(
    { experimentId: experimentId as string },
    { enabled: !!experimentId },
  );
  const openDrawer = useAppStore((s) => s.openDrawer);

  const scenarios = api.scenarios.list.useQuery(
    { experimentId: experimentId as string },
    { enabled: !!experimentId },
  );

  if (!variants.data || !scenarios.data) return null;

  const allCols = variants.data.length + 1;
  const headerRows = 3;

  return (
    <Grid
      p={4}
      pb={24}
      display="grid"
      gridTemplateColumns={`250px repeat(${variants.data.length}, minmax(300px, 1fr)) auto`}
      sx={{
        "> *": {
          borderColor: "gray.300",
          borderBottomWidth: 1,
          borderRightWidth: 1,
        },
      }}
      fontSize="sm"
    >
      <GridItem
        display="flex"
        alignItems="flex-end"
        rowSpan={headerRows}
        px={cellPadding.x}
        py={cellPadding.y}
        // TODO: This is a hack to get the sticky header to work. It's not ideal because it's not responsive to the height of the header,
        // so if the header height changes, this will need to be updated.
        sx={{ ...stickyHeaderStyle, top: "-337px" }}
      >
        <HStack w="100%">
          <Heading size="xs" fontWeight="bold" flex={1}>
            Scenarios ({scenarios.data.length})
          </Heading>
          <Button
            size="xs"
            variant="ghost"
            color="gray.500"
            aria-label="Edit"
            leftIcon={<BsPencil />}
            onClick={openDrawer}
          >
            Edit Vars
          </Button>
        </HStack>
      </GridItem>

      {variants.data.map((variant) => (
        <GridItem key={variant.uiId} padding={0} sx={stickyHeaderStyle} borderTopWidth={1}>
          <VariantHeader variant={variant} canHide={variants.data.length > 1} />
        </GridItem>
      ))}
      <GridItem
        rowSpan={scenarios.data.length + headerRows}
        padding={0}
        // Have to use `style` instead of emotion style props to work around css specificity issues conflicting with the "> *" selector on Grid
        style={{ borderRightWidth: 0, borderBottomWidth: 0 }}
        h={8}
        sx={stickyHeaderStyle}
      >
        <NewVariantButton />
      </GridItem>

      {variants.data.map((variant) => (
        <GridItem key={variant.uiId}>
          <VariantEditor variant={variant} />
        </GridItem>
      ))}
      {variants.data.map((variant) => (
        <GridItem key={variant.uiId}>
          <VariantStats variant={variant} />
        </GridItem>
      ))}
      {scenarios.data.map((scenario) => (
        <ScenarioRow
          key={scenario.uiId}
          scenario={scenario}
          variants={variants.data}
          canHide={scenarios.data.length > 1}
        />
      ))}
      <GridItem borderBottomWidth={0} borderRightWidth={0} w="100%" colSpan={allCols} padding={0}>
        <NewScenarioButton />
      </GridItem>
    </Grid>
  );
}
