import { Icon, Button, Spinner, Text, type ButtonProps } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { BsPlusSquare } from "react-icons/bs";
import { useHandledAsyncCallback } from "~/utils/hooks";

export const NewExperimentButton = (props: ButtonProps) => {
  const router = useRouter();
  const utils = api.useContext();
  const createMutation = api.experiments.create.useMutation();
  const [createExperiment, isLoading] = useHandledAsyncCallback(async () => {
    const newExperiment = await createMutation.mutateAsync({ label: "New Experiment" });
    await utils.experiments.list.invalidate();
    await router.push({ pathname: "/experiments/[id]", query: { id: newExperiment.id } });
  }, [createMutation, router]);

  return (
    <Button
      onClick={createExperiment}
      display="flex"
      alignItems="center"
      variant={{ base: "solid", md: "ghost" }}
      {...props}
    >
      <Icon as={isLoading ? Spinner : BsPlusSquare} boxSize={4} />
      <Text display={{ base: "none", md: "block" }} ml={2}>
        New Experiment
      </Text>
    </Button>
  );
};
