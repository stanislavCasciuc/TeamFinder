import { Modal, TextInput, Button } from "@mantine/core";
import { useState } from "react";
import axios from "../../api/axios";
import { GETPROJECT, POSTPROJECTTECHNOLOIES } from "../EndPoints";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { mutate } from "swr";

interface AddProjectTechnologiesProps {
  close: () => void;
}

const AddProjectTechnologies = ({ close }: AddProjectTechnologiesProps) => {
  const [technology, setTechnology] = useState("");
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const { project_id } = useParams();

  const handleAddTechnology = () => {
    axios
      .post(
        POSTPROJECTTECHNOLOIES +
          `?name=${technology}&project_id=${project_id} `,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        mutate(GETPROJECT + `/${project_id}`);
      });
  };

  return (
    <Modal opened={true} onClose={close}>
      <div>
        <TextInput
          label="Technology Name"
          placeholder="Enter Technology Name"
          onChange={(event) => {
            setTechnology(event.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {
            handleAddTechnology();
            close();
          }}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default AddProjectTechnologies;
