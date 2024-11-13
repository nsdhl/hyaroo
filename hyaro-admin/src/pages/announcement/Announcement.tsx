import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IProduct, IAnnouncement } from "../../types/interfaces";
import { When } from "../../components/hoc/When";
import LoaderComponent from "../../components/loader/Loader";
import { getAdminProducts } from "../../api";
import toast from "react-hot-toast";
import { url } from "../../axios";

export default function Announcement() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<IProduct | undefined>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hasPrevious, setHasPrevious] = useState(false);
  const announcemetIdRef = useRef<string | null>(null);

  const getAnnouncement = async (): Promise<IAnnouncement | undefined> => {
    const {
      data,
      status,
    }: { data: { announcements: IAnnouncement[] }; status: number } =
      await url.get("/app-feature/announcements");
    if (status === 200) {
      const announcement = data.announcements.find(
        (announcement) => !announcement.isDeleted
      );

      return announcement;
    } else {
      toast.error("Failed to fetch announcement");
    }
  };

  const updateAnnouncement = async () => {
    const { status } = await url.put(
      `/app-feature/announcements/${product?._id}`,
      {
        title,
        description,
      }
    );

    if (status === 200) {
      toast.success("Announcement updated successfully");
    } else {
      toast.error("Failed to update announcement");
    }
  };

  const createAnnouncement = async () => {
    const { data, status }: { data: { _id: string }; status: number } =
      await url.post("/app-feature/announcements", {
        title,
        description,
        productId: product?._id,
      });

    if (status === 201) {
      announcemetIdRef.current = data._id;
      toast.success("Announcement created successfully");
    } else {
      toast.error("Failed to create announcement");
    }
  };

  const handleClick = () => {
    setLoading(true);
    if (hasPrevious) {
      updateAnnouncement();
    } else {
      createAnnouncement();
      setHasPrevious(true);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const { status } = await url.delete(
      `/app-feature/announcements/${announcemetIdRef.current}`
    );

    if (status === 200) {
      toast.success("Announcement deleted successfully");
      setTitle("");
      setDescription("");
      setProduct(undefined);
      announcemetIdRef.current = null;
      setHasPrevious(false);
    } else {
      toast.error("Failed to delete announcement");
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const [products, announcement] = await Promise.all([
        getAdminProducts(),
        getAnnouncement(),
      ]);

      if (announcement) {
        setTitle(announcement.title);
        setDescription(announcement.description);
        setProduct(announcement.productId);
        announcemetIdRef.current = announcement._id;
        setHasPrevious(true);
      }

      setProducts(products);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Stack mb="1.5em" spacing={2}>
        <Typography variant="h3">Announcement</Typography>
        <TextField
          variant="filled"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          multiline={true}
          rows={4}
          placeholder="Announcement Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Typography variant="h5">Link Product</Typography>
        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Choose Product" variant="outlined" />
          )}
          onChange={(_, newValue) => setProduct(newValue as IProduct)}
          value={product}
          freeSolo={false}
        />
        <Stack direction="row" spacing={2} width={"100%"}>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{ width: "100%" }}
          >
            {hasPrevious ? "Update" : "Create"}
          </Button>
          {hasPrevious && (
            <Button
              variant="contained"
              sx={{ bgcolor: "red", width: "100%" }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
}
