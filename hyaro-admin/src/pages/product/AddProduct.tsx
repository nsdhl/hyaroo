import {
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import type { ICategory, IVariant } from "../../types/interfaces";
import { getCategories } from "../../api";
import {
  AddCircleOutlineSharp,
  CancelSharp,
  DeleteOutline,
} from "@mui/icons-material";
import { url } from "../../axios";
import { Mode } from "../../types/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { When } from "../../components/hoc/When";
import LoaderComponent from "../../components/loader/Loader";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";

interface IAddProduct {
  mode: Mode.POST | Mode.EDIT | Mode.VIEW;
}

const AddProduct: FC<IAddProduct> = ({ mode }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<{
    _id: string;
    name: string;
    stock: boolean;
    description: string;
    basePrice: string;
    categories: ICategory[];
    variants: IVariant;
  }>({
    _id: "",
    name: "",
    stock: true,
    description: "",
    basePrice: "",
    categories: [],
    variants: {
      "": [
        {
          name: "",
          additionalCost: "",
          variantStock: true,
        },
      ],
    },
  });

  //for mode=post
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [promotionalImages, setPromotionalImages] = useState<File[]>([]);

  //for view mode=view
  const [viewModeImages, setViewModeImages] = useState<string[]>([]);
  const [viewModeVideos, setViewModeVideos] = useState<string[]>([]);
  const [viewModePromotionalImages, setViewModePromotionalImages] = useState<
    string[]
  >([]);

  //for mode=edit
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videosToDelete, setVideosToDelete] = useState<string[]>([]);
  const [promotionalImagesToDelete, setPromotionalImagesToDelete] = useState<
    string[]
  >([]);

  const [loading, setLoading] = useState(false);

  //list of available categories
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);

  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const toggleIsFeatured = () => setIsFeatured(!isFeatured);
  const [featuredOrder, setFeaturedOrder] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const category = await getCategories();
      setCategoryList(category);
    })();
  }, [mode]);

  useEffect(() => {
    (async () => {
      if (mode === Mode.VIEW) {
        setLoading(true);
        const { productId } = params;
        const { data } = await url.get(`/product/${productId}`);
        setViewModeImages(data.images);
        setViewModeVideos(data.videos);
        setViewModePromotionalImages(data.promotionalImages);
        delete data.images;
        delete data.videos;
        delete data.promotionalImages;
        setProduct(data);
        setLoading(false);
        setIsFeatured(data.isFeatured);
        setFeaturedOrder(data.featuredOrder);
      }

      if (mode === Mode.EDIT) {
        setLoading(true);
        const { productId } = params;
        if (!product._id) {
          navigate(`/view/${productId}`);
          return;
        }

        const { data } = await url.get(`/product/${productId}`);
        setViewModeImages(data.images);
        setViewModeVideos(data.videos);
        setViewModePromotionalImages(data.promotionalImages);
        delete data.images;
        delete data.videos;
        delete data.promotionalImages;
        setProduct(data);
        setIsFeatured(data.isFeatured);
        setFeaturedOrder(data.featuredOrder);
        // viewModeImages.map(async (image: string) => {
        //   const imageFile = await imageUrlToFile(`${apiUrl}/product/${image}`)
        //   setImages(prev => ([...prev, imageFile as File]))
        // })

        // viewModeVideos.map(async (video: string) => {
        //   const videoFile = await videoUrlToFile(`${apiUrl}/product/${video}`)
        //   setVideos(prev => ([...prev, videoFile as File]))
        // })

        setLoading(false);
      }
    })();
  }, [mode]);

  const handleSave = async () => {
    if (
      !product.name ||
      !product.basePrice ||
      product.categories.length === 0 ||
      !product.description
    ) {
      toast.error("Please enter all fields!");
      return;
    }

    if (featuredOrder && featuredOrder > 12) {
      toast.error("Featured order can't be greater than 12!");
      return;
    }

    if (mode === Mode.POST) {
      if (images.length === 0) {
        toast.error("Please enter all fields!");
        return;
      }
    }

    if (mode === Mode.EDIT) {
      if (viewModeImages.length === 0) {
        if (images.length === 0) {
          toast.error("Please enter all fields!");
          return;
        }
      }
    }

    function checkVariantEmpty() {
      let checkVariantEmpty = false;

      if (Object.keys(product.variants).length === 0) {
        checkVariantEmpty = true;
      }
      Object.keys(product.variants).map((variantType) => {
        if (variantType === "") {
          checkVariantEmpty = true;
        }
        if (product.variants[variantType].length === 0) {
          checkVariantEmpty = true;
        }
        product.variants[variantType].map((variant) => {
          if (!variant.name || !variant.additionalCost) {
            checkVariantEmpty = true;
          }
        });
      });
      return checkVariantEmpty;
    }
    if (checkVariantEmpty()) {
      toast.error("Please enter all variant fields!");
      return;
    }

    let formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image, image.name);
    });
    videos.forEach((video) => {
      formData.append("videos", video, video.name);
    });
    promotionalImages.forEach((image) => {
      formData.append("promotionalImages", image, image.name);
    });
    formData.append("name", product.name);
    formData.append("variants", JSON.stringify(product.variants));
    formData.append("stock", String(product.stock));
    formData.append("description", product.description);
    formData.append("basePrice", product.basePrice);
    imagesToDelete.forEach((image) => {
      formData.append("imagesToDelete", image);
    });
    videosToDelete.forEach((video) => {
      formData.append("videosToDelete", video);
    });
    promotionalImagesToDelete.forEach((image) => {
      formData.append("promotionalImagesToDelete", image);
    });
    product.categories.forEach((cat: ICategory) => {
      formData.append("categories", cat._id.toString());
    });

    const putFeatured = async () => {
      const req = isFeatured ? { isFeatured, featuredOrder } : { isFeatured };
      const res = await url.put(`/product/featured/${product._id}`, req);
      return res;
    };

    if (mode === Mode.POST) {
      setLoading(true);
      await url.post("/product/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product has been added!");
      setLoading(false);
    }

    if (mode === Mode.EDIT) {
      setLoading(true);
      await url.patch(`/product/${product._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await putFeatured();
      if (res.status === 200) {
        if (isFeatured) {
          toast.success("Listed as featured product!");
        }
      } else if (res.status === 400) {
        toast.error("Invalid Order Number!");
      } else {
        toast.error("Something went wrong!");
      }

      toast.success("Product has been edited!");
      setLoading(false);
    }
  };

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <When condition={mode === Mode.POST}>
        <Typography variant="h3">Add Product</Typography>
      </When>

      <When condition={mode === Mode.VIEW}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3">{product.name}</Typography>
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/edit/${product._id}`);
            }}
          >
            Edit
          </Button>
        </Stack>
      </When>

      <Stack direction="column" m="1.5em 0em" rowGap="1.5em">
        <TextField
          id="name"
          variant="filled"
          type="text"
          label="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, name: e.target.value }))
          }
          disabled={mode === Mode.VIEW}
        />

        <Stack>
          <InputLabel id="stock-select">Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            id="stock-select"
            value={product.stock}
            label="Stock"
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                stock: e.target.value === "true" ? true : false,
              }))
            }
            variant="filled"
            disabled={mode === Mode.VIEW}
          >
            <MenuItem value={"true"}>True</MenuItem>
            <MenuItem value={"false"}>False</MenuItem>
          </Select>
        </Stack>

        <ReactQuill
          theme="snow"
          placeholder="Description"
          onChange={(value) =>
            setProduct((prev) => ({ ...prev, description: value }))
          }
          value={product.description}
          style={{
            height: "200px",
            marginBottom: "50px",
          }}
          readOnly={mode === Mode.VIEW}
        />

        <TextField
          id="basePrice"
          variant="filled"
          type="number"
          label="Base Price"
          value={product.basePrice}
          disabled={mode === Mode.VIEW}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, basePrice: e.target.value }))
          }
        />

        <Stack>
          <InputLabel id="stock-select">Categories</InputLabel>
          <Select
            labelId="stock-select-label"
            id="stock-select"
            label="Categories"
            variant="filled"
            disabled={mode === Mode.VIEW}
          >
            {categoryList.map((category, key) => {
              return (
                <MenuItem
                  key={key}
                  onClick={() => {
                    setProduct((prev) => ({
                      ...prev,
                      categories: [...prev.categories, category],
                    }));
                  }}
                  value={category.category}
                >
                  {category.category}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>

        <Stack direction="row" columnGap="1.5em">
          {product.categories.map((el, key) => {
            return (
              <Stack
                key={key}
                direction="row"
                alignItems="center"
                columnGap="10px"
              >
                <Typography variant="body2">{el.category}</Typography>
                <When condition={mode !== Mode.VIEW}>
                  <CancelSharp
                    fontSize="small"
                    onClick={() => {
                      setProduct((prev) => {
                        const updatedCategory = prev.categories.filter(
                          (c) => c._id !== el._id
                        );
                        return {
                          ...prev,
                          categories: updatedCategory,
                        };
                      });
                    }}
                  />
                </When>
              </Stack>
            );
          })}
        </Stack>

        <When condition={mode === Mode.EDIT || mode === Mode.VIEW}>
          <Stack>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch onChange={toggleIsFeatured} checked={isFeatured} />
                }
                label="Make Featured Product"
                disabled={mode === Mode.VIEW}
              />
            </FormGroup>
            {isFeatured && (
              <>
                <InputLabel id="order">Order(1-12)</InputLabel>
                <Input
                  value={featuredOrder}
                  onChange={(e) => setFeaturedOrder(+e.target.value)}
                  type="number"
                  id="order"
                  disabled={mode === Mode.VIEW}
                />
              </>
            )}
          </Stack>
        </When>


        <Stack direction="column">
          <Stack direction="row" columnGap="2.5em" alignItems="center">
            <Typography variant="h5">Variants</Typography>
            <When condition={mode !== Mode.VIEW}>
              <AddCircleOutlineSharp
                fontSize="medium"
                onClick={() => {
                  setProduct((prev) => {
                    return {
                      ...prev,
                      variants: {
                        ...prev.variants,
                        "": [
                          { name: "", additionalCost: "", variantStock: true },
                        ],
                      },
                    };
                  });
                }}
              />
            </When>
          </Stack>
          {Object.keys(product.variants).map((variantType, key) => {
            return (
              <Stack key={key} direction="column" rowGap="1.5em" p="1.5em 0em">
                <Stack direction="row" columnGap="3em" alignItems="center">
                  <TextField
                    id="variant-type"
                    variant="filled"
                    type="text"
                    label="Variant Type"
                    value={variantType}
                    disabled={mode === Mode.VIEW}
                    onChange={(e) => {
                      let v = product.variants;
                      v[e.target.value] = v[variantType];
                      delete v[variantType];
                      setProduct((prev) => ({ ...prev, variants: v }));
                    }}
                    sx={{ flexBasis: "80%" }}
                  />
                  <When condition={mode !== Mode.VIEW}>
                    {
                      <DeleteOutline
                        onClick={() => {
                          let v = product.variants;
                          delete v[variantType];
                          setProduct((prev) => ({ ...prev, variants: v }));
                        }}
                      />
                    }
                  </When>
                </Stack>
                {product.variants[variantType].map((variant, key) => {
                  return (
                    <Stack
                      key={key}
                      direction="row"
                      alignItems="flex-start"
                      columnGap="3em"
                    >
                      <Stack direction="column" rowGap="1.5em" flexBasis="60%">
                        <TextField
                          id="variant-name"
                          variant="filled"
                          type="text"
                          label="Variant Name"
                          value={variant.name}
                          disabled={mode === Mode.VIEW}
                          onChange={(e) => {
                            let v = product.variants[variantType];
                            v[key] = { ...variant, name: e.target.value };

                            let p = product.variants;
                            p[variantType] = v;
                            setProduct((prev) => ({
                              ...prev,
                              variants: p,
                            }));
                          }}
                        />
                        <TextField
                          id="variant-additional-cost"
                          variant="filled"
                          type="text"
                          label="Additional Cost"
                          disabled={mode === Mode.VIEW}
                          value={variant.additionalCost}
                          onChange={(e) => {
                            let v = product.variants[variantType];
                            v[key] = {
                              ...variant,
                              additionalCost: e.target.value,
                            };

                            let p = product.variants;
                            p[variantType] = v;
                            setProduct((prev) => ({
                              ...prev,
                              variants: p,
                            }));
                          }}
                        />

                        <Stack>
                          <InputLabel id="variant-stock-select">
                            Stock
                          </InputLabel>
                          <Select
                            labelId="vairant-select-label"
                            id="variant-stock-select"
                            value={variant.variantStock}
                            label="Stock"
                            variant="filled"
                            disabled={mode === Mode.VIEW}
                            onChange={(e) => {
                              let v = product.variants[variantType];
                              v[key] = {
                                ...variant,
                                variantStock:
                                  e.target.value === "true" ? true : false,
                              };

                              let p = product.variants;
                              p[variantType] = v;
                              setProduct((prev) => ({
                                ...prev,
                                variants: p,
                              }));
                            }}
                          >
                            <MenuItem value={"true"}>True</MenuItem>
                            <MenuItem value={"false"}>False</MenuItem>
                          </Select>
                        </Stack>
                        <Divider />
                      </Stack>
                      <When condition={mode !== Mode.VIEW}>
                        {product.variants[variantType].length > 1 && (
                          <DeleteOutline
                            onClick={() => {
                              setProduct((prev) => {
                                return {
                                  ...prev,
                                  variants: {
                                    ...prev.variants,
                                    [variantType]: prev.variants[
                                      variantType
                                    ].filter((el) => el.name !== variant.name),
                                  },
                                };
                              });
                            }}
                          />
                        )}
                      </When>
                    </Stack>
                  );
                })}
                <When condition={mode !== Mode.VIEW}>
                  <Button
                    onClick={() => {
                      setProduct((prev) => {
                        return {
                          ...prev,
                          variants: {
                            ...prev.variants,
                            [variantType]: [
                              ...prev.variants[variantType],
                              {
                                name: "",
                                additionalCost: "",
                                variantStock: true,
                              },
                            ],
                          },
                        };
                      });
                    }}
                    variant="outlined"
                  >
                    Add
                  </Button>
                </When>
              </Stack>
            );
          })}
        </Stack>

        <When condition={mode === Mode.EDIT || mode === Mode.POST}>
          <Typography variant="h5">Upload Images</Typography>
          <Stack
            direction="column"
            sx={{
              padding: "1.5em 0em",
              border: "2px solid #55f",
              borderStyle: "dashed",
            }}
            component="label"
            htmlFor="img-input"
          >
            <input
              type="file"
              multiple
              style={{
                display: "none",
              }}
              name="img-input"
              id="img-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  const selectedFiles: FileList = e.target.files;
                  const fileArray: File[] = Array.from(selectedFiles);
                  setImages((prev) => [...prev, ...fileArray]);
                  e.target.value = "";
                }
              }}
            />
            <Typography variant="h6" textAlign="center">
              Upload Images
            </Typography>
          </Stack>

          <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
            {images.map((file, index) => (
              <Stack direction="row" key={index} columnGap="0.5em">
                <img
                  src={file && URL?.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  style={{ width: "100px" }}
                />
                <CancelSharp
                  fontSize="small"
                  onClick={() =>
                    setImages((prev) => {
                      return prev.filter((el) => el !== file);
                    })
                  }
                />
              </Stack>
            ))}
          </Stack>

          <When condition={mode === Mode.EDIT}>
            <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
              {viewModeImages.map((image, index) => (
                <Stack direction="row" key={index} columnGap="0.5em">
                  <img
                    src={`${apiUrl}/product/${image}`}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <CancelSharp
                    fontSize="small"
                    onClick={() => {
                      setImagesToDelete((prev) => [...prev, image]);
                      setViewModeImages((prev) => {
                        return prev.filter((el) => el !== image);
                      });
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </When>

          <Typography variant="h5">Upload Promotional Images</Typography>
          <Stack
            direction="column"
            sx={{
              padding: "1.5em 0em",
              border: "2px solid #55f",
              borderStyle: "dashed",
            }}
            component="label"
            htmlFor="promo-img-input"
          >
            <input
              type="file"
              multiple
              style={{
                display: "none",
              }}
              name="promo-img-input"
              id="promo-img-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  const selectedFiles: FileList = e.target.files;
                  const fileArray: File[] = Array.from(selectedFiles);
                  setPromotionalImages((prev) => [...prev, ...fileArray]);
                  e.target.value = "";
                }
              }}
            />
            <Typography variant="h6" textAlign="center">
              Upload Promotional Images
            </Typography>
          </Stack>

          <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
            {promotionalImages.map((file, index) => (
              <Stack direction="row" key={index} columnGap="0.5em">
                <img
                  src={file && URL?.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  style={{ width: "100px" }}
                />
                <CancelSharp
                  fontSize="small"
                  onClick={() =>
                    setImages((prev) => {
                      return prev.filter((el) => el !== file);
                    })
                  }
                />
              </Stack>
            ))}
          </Stack>

          <When condition={mode === Mode.EDIT}>
            <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
              {viewModePromotionalImages.map((image, index) => (
                <Stack direction="row" key={index} columnGap="0.5em">
                  <img
                    src={`${apiUrl}/product/${image}`}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <CancelSharp
                    fontSize="small"
                    onClick={() => {
                      setPromotionalImagesToDelete((prev) => [...prev, image]);
                      setViewModePromotionalImages((prev) => {
                        return prev.filter((el) => el !== image);
                      });
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </When>

          <Typography variant="h5">Upload Videos</Typography>
          <Stack
            direction="column"
            sx={{
              padding: "1.5em 0em",
              border: "2px solid #55f",
              borderStyle: "dashed",
            }}
            component="label"
            htmlFor="vid-input"
          >
            <input
              type="file"
              multiple
              style={{
                display: "none",
              }}
              name="vid-input"
              id="vid-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  const selectedFiles: FileList = e.target.files;
                  const fileArray: File[] = Array.from(selectedFiles);
                  setVideos((prev) => [...prev, ...fileArray]);
                  e.target.value = "";
                }
              }}
            />
            <Typography variant="h6" textAlign="center">
              Upload Videos
            </Typography>
          </Stack>

          <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
            {videos.map((file, index) => (
              <Stack direction="row" key={index} columnGap="0.5em">
                <video width="200" controls>
                  <source src={file && URL?.createObjectURL(file)} />
                </video>
                <CancelSharp
                  fontSize="small"
                  onClick={() =>
                    setVideos((prev) => {
                      return prev.filter((el) => el !== file);
                    })
                  }
                />
              </Stack>
            ))}
          </Stack>

          <When condition={mode === Mode.EDIT}>
            <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
              {viewModeVideos.map((video, index) => (
                <Stack direction="row" key={index} columnGap="0.5em">
                  <video width="200" controls>
                    <source src={`${apiUrl}/product/${video}`} />
                  </video>
                  <CancelSharp
                    fontSize="small"
                    onClick={() => {
                      setVideosToDelete((prev) => [...prev, video]);
                      setViewModeVideos((prev) => {
                        return prev.filter((el) => el !== video);
                      });
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </When>
        </When>

        <When condition={mode === Mode.VIEW}>
          <Typography variant="h6">Images</Typography>
          <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
            {viewModeImages.map((image, key) => {
              return (
                <img
                  src={`${apiUrl}/product/${image}`}
                  alt={image}
                  key={key}
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "cover",
                  }}
                />
              );
            })}
          </Stack>
          <Typography variant="h6">promotional Images</Typography>
          <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
            {viewModePromotionalImages.map((image, key) => {
              return (
                <img
                  src={`${apiUrl}/product/${image}`}
                  alt={image}
                  key={key}
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "cover",
                  }}
                />
              );
            })}
          </Stack>
          <Typography variant="h6">Videos</Typography>
          <Stack direction="row" columnGap="1.5em" flexWrap="wrap">
            {viewModeVideos.map((video, key) => {
              return (
                <video width="200" controls key={key}>
                  <source src={`${apiUrl}/product/${video}`} />
                </video>
              );
            })}
          </Stack>
        </When>

        <When condition={mode !== Mode.VIEW}>
          <Button variant="contained" onClick={handleSave}>
            <Typography variant="body1">Save</Typography>
          </Button>
        </When>
      </Stack>
    </>
  );
};

export default AddProduct;
