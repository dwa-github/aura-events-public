// /components/AddEventForm/AddEventForm.jsx
import React, { useState, useContext, useEffect } from "react"
import styles from "./AddEventForm.module.css"
import UserContext from "@/context/UserContext"
import { generateSlug } from "@/lib/utils"
import Button from "@/components/Button/Button"

const formatDateForInput = (isoDate) => {
  if (!isoDate) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return isoDate
  }
  try {
    return new Date(isoDate).toISOString().split("T")[0]
  } catch (error) {
    return ""
  }
}

const MIN_IMAGE_WIDTH = 1200
const MIN_IMAGE_HEIGHT = 675
const TARGET_ASPECT_RATIO = 16 / 9
const ASPECT_RATIO_TOLERANCE = 0.05

const AddEventForm = ({
  categories,
  countries,
  cities,
  locations,
  artists,
  onSubmit,
  onCancel,
  isSubmitting: propIsSubmitting,
  isEditMode = false,
  eventToEdit = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    slug: "",
    date: "",
    countryId: "",
    categoryId: "",
    cityId: "",
    imageFile: null,
    capacity: "100",
    artist1Id: "",
    artist2Id: "",
    artist3Id: "",
    location: "",
    bulletPoint1: "",
    bulletPoint2: "",
    bulletPoint3: "",
    startTime: "",
  })

  const [filteredCities, setFilteredCities] = useState([])
  const [filteredVenues, setFilteredVenues] = useState([])
  const [filteredArtists, setFilteredArtists] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  useEffect(() => {
    let currentPreview = imagePreview
    return () => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview)
      }
    }
  }, [imagePreview])

  useEffect(() => {
    if (isEditMode && eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        slug: eventToEdit.slug || "",
        description: eventToEdit.description || "",
        fullDescription: eventToEdit.fullDescription || "",
        date: eventToEdit.date ? formatDateForInput(eventToEdit.date) : "",
        startTime: eventToEdit.timeDetails || "",
        countryId: eventToEdit.countryId || "",
        categoryId: eventToEdit.categoryId || "",
        cityId: eventToEdit.cityId || "",
        location: eventToEdit.locationId || "",
        capacity: String(eventToEdit.capacity || "100"),
        artist1Id:
          eventToEdit.artists?.[0]?.id || eventToEdit.artists?.[0] || "",
        artist2Id:
          eventToEdit.artists?.[1]?.id || eventToEdit.artists?.[1] || "",
        artist3Id:
          eventToEdit.artists?.[2]?.id || eventToEdit.artists?.[2] || "",
        bulletPoint1: eventToEdit.bulletPoint_1 || "",
        bulletPoint2: eventToEdit.bulletPoint_2 || "",
        bulletPoint3: eventToEdit.bulletPoint_3 || "",
        imageFile: null,
      })
      if (eventToEdit.imageUrl) {
        setImagePreview(eventToEdit.imageUrl)
      }
    }
  }, [isEditMode, eventToEdit, artists, locations, cities, categories])

  useEffect(() => {
    if (formData.countryId && cities) {
      const newFilteredCities = cities.filter(
        (city) => city.countryId === formData.countryId
      )
      setFilteredCities(newFilteredCities)
    } else {
      setFilteredCities([])
    }
  }, [formData.countryId, cities])

  useEffect(() => {
    if (formData.cityId && locations) {
      const newFilteredVenues = locations.filter(
        (loc) => loc.cityId === formData.cityId
      )
      setFilteredVenues(newFilteredVenues)
    } else {
      setFilteredVenues([])
    }
  }, [formData.cityId, locations])

  useEffect(() => {
    if (formData.categoryId && artists && Array.isArray(artists)) {
      const newFilteredArtists = artists.filter(
        (artist) => String(artist.categoryId) === String(formData.categoryId)
      )
      setFilteredArtists(newFilteredArtists)
    } else {
      setFilteredArtists([])
    }
  }, [formData.categoryId, artists])

  const { currentUser } = useContext(UserContext)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "imageFile") {
      const file = e.target.files[0]
      setErrors((prev) => ({ ...prev, imageFile: null }))
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      }
      setFormData((prev) => ({ ...prev, imageFile: null }))

      if (file) {
        const reader = new FileReader()
        reader.onload = (e_reader) => {
          const img = new Image()
          img.onload = () => {
            const { width, height } = img
            const aspectRatio = width / height
            let imageError = null

            if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) {
              imageError = `Image must be at least ${MIN_IMAGE_WIDTH}px wide and ${MIN_IMAGE_HEIGHT}px high. (Yours: ${width}x${height})`
            } else if (
              Math.abs(aspectRatio - TARGET_ASPECT_RATIO) >
              ASPECT_RATIO_TOLERANCE
            ) {
              imageError = `Image aspect ratio should be 16:9 (e.g., ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}). Yours is ~${width}x${height} (${aspectRatio.toFixed(
                2
              )}:1).`
            }

            if (imageError) {
              setErrors((prev) => ({ ...prev, imageFile: imageError }))
              if (e.target) e.target.value = null
            } else {
              setImagePreview(URL.createObjectURL(file))
              setFormData((prev) => ({ ...prev, imageFile: file }))
            }
          }
          img.onerror = () => {
            setErrors((prev) => ({
              ...prev,
              imageFile: "Invalid image file. Please select a valid image.",
            }))
            if (e.target) e.target.value = null
          }
          img.src = e_reader.target.result
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData((prev) => {
        let newCityId = prev.cityId
        let newLocationId = prev.location
        let newArtist1Id = prev.artist1Id
        let newArtist2Id = prev.artist2Id
        let newArtist3Id = prev.artist3Id

        if (name === "countryId") {
          newCityId = ""
          newLocationId = ""
        } else if (name === "cityId") {
          newLocationId = ""
        } else if (name === "categoryId") {
          newArtist1Id = ""
          newArtist2Id = ""
          newArtist3Id = ""
        }

        if (name === "artist1Id") {
          newArtist2Id = ""
          newArtist3Id = ""
        }
        if (name === "artist2Id") {
          newArtist3Id = ""
        }

        const updatedState = {
          ...prev,
          cityId: newCityId,
          location: newLocationId,
          artist1Id:
            name === "categoryId"
              ? ""
              : name === "artist1Id"
              ? value
              : newArtist1Id,
          artist2Id:
            name === "categoryId" || name === "artist1Id"
              ? ""
              : name === "artist2Id"
              ? value
              : newArtist2Id,
          artist3Id:
            name === "categoryId" ||
            name === "artist1Id" ||
            name === "artist2Id"
              ? ""
              : name === "artist3Id"
              ? value
              : newArtist3Id,
        }

        if (type === "checkbox") {
          updatedState[name] = checked
        } else {
          updatedState[name] = value
        }

        if (name === "title" && type !== "checkbox") {
          updatedState.slug = generateSlug(value)
        }
        return updatedState
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required."
    if (!formData.description.trim())
      newErrors.description = "Short description is required."
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = "Full description is required."
    if (!formData.date) newErrors.date = "Date is required."
    if (!formData.startTime) newErrors.startTime = "Start time is required."
    if (!formData.countryId) newErrors.countryId = "Country is required."
    if (!formData.cityId) newErrors.cityId = "City is required."
    if (!formData.location) newErrors.location = "Venue is required."
    if (!formData.categoryId) newErrors.categoryId = "Category is required."
    if (!formData.artist1Id)
      newErrors.artist1Id = "At least one artist is required."

    if (!isEditMode || (isEditMode && !imagePreview)) {
      if (errors.imageFile) {
        newErrors.imageFile = errors.imageFile
      } else if (!formData.imageFile) {
        newErrors.imageFile = "An event image is required."
      }
    }

    if (
      isNaN(parseInt(formData.capacity, 10)) ||
      parseInt(formData.capacity, 10) <= 0
    )
      newErrors.capacity = "Capacity must be a positive number."
    if (!formData.bulletPoint1.trim())
      newErrors.bulletPoint1 = "Bullet point 1 is required."
    if (!formData.bulletPoint2.trim())
      newErrors.bulletPoint2 = "Bullet point 2 is required."
    if (!formData.bulletPoint3.trim())
      newErrors.bulletPoint3 = "Bullet point 3 is required."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      setErrors((prev) => ({
        ...prev,
        form: "You must be logged in to add an event.",
      }))
      return
    }

    if (!validateForm()) {
      return
    }
    const selectedVenue = locations?.find((loc) => loc.id === formData.location)
    const selectedArtistIds = [
      formData.artist1Id,
      formData.artist2Id,
      formData.artist3Id,
    ].filter((id) => id !== "")

    const timeDetailsToSubmit = formData.startTime

    const newEventData = {
      description: formData.description,
      fullDescription: formData.fullDescription,
      date: formatDateForInput(formData.date),
      timeDetails: timeDetailsToSubmit,
      countryId: formData.countryId,
      categoryId: formData.categoryId,
      cityId: formData.cityId,
      capacity: parseInt(formData.capacity, 10),
      location: formData.location,
      bulletPoint1: formData.bulletPoint1,
      bulletPoint2: formData.bulletPoint2,
      bulletPoint3: formData.bulletPoint3,
      artists: selectedArtistIds,
      locationName: selectedVenue?.name || "",
      locationAddress: selectedVenue?.address || "",
      isOnline: false,
      primaryCtaText: "Book Tickets",
      primaryCtaLink: "#",
      secondaryCtaText: "View Program",
      secondaryCtaLink: "#event-details-anchor",
      imageUrl:
        isEditMode && eventToEdit?.imageUrl && !formData.imageFile
          ? eventToEdit.imageUrl
          : "",
    }

    if (isEditMode && eventToEdit) {
      newEventData.title = formData.title
      newEventData.slug = formData.slug || generateSlug(formData.title)
      newEventData.organizerUserId = eventToEdit.organizerUserId
      newEventData.id = eventToEdit.id
    } else {
      newEventData.title = formData.title
      newEventData.slug = formData.slug || generateSlug(formData.title)
      newEventData.organizerUserId = currentUser.id
    }

    if (formData.imageFile) {
      setIsUploadingImage(true)
      try {
        const imageFileToUpload = formData.imageFile
        const eventTitleSlug = generateSlug(formData.title)
        const fileNameParts = imageFileToUpload.name.split(".")
        const fileExtension =
          fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : "jpg"
        const blobFilename = `events/${eventTitleSlug}.${fileExtension}`

        const response = await fetch(
          `/api/upload-image?filename=${encodeURIComponent(blobFilename)}`,
          {
            method: "POST",
            body: imageFileToUpload,
          }
        )

        if (!response.ok) {
          const errorResult = await response.json().catch(() => ({
            message: "Image upload failed with status: " + response.status,
          }))
          throw new Error(errorResult.message || "Image upload failed")
        }

        const blobResult = await response.json()
        newEventData.imageUrl = blobResult.url

        await onSubmit(newEventData, isEditMode, eventToEdit?.id)
      } catch (uploadError) {
        setErrors((prev) => ({
          ...prev,
          imageFile: `Image upload failed: ${uploadError.message}`,
        }))
      } finally {
        setIsUploadingImage(false)
      }
    } else if (isEditMode && eventToEdit?.imageUrl) {
      await onSubmit(newEventData, isEditMode, eventToEdit.id)
    } else {
      await onSubmit(newEventData, isEditMode)
    }
  }

  const getAvailableArtistsForSelect = (excludeIds = []) => {
    if (!filteredArtists || !Array.isArray(filteredArtists)) return []
    return filteredArtists.filter((artist) => !excludeIds.includes(artist.id))
  }

  const isFormSubmitting = propIsSubmitting || isUploadingImage

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {isEditMode ? "Edit Event" : "Create New Event"}
      </h2>
      <div className={styles.formGroup}>
        <label htmlFor="countryId" className={styles.label}>
          Country
        </label>
        <select
          id="countryId"
          name="countryId"
          value={formData.countryId}
          onChange={handleChange}
          className={`${styles.select} ${
            errors.countryId ? styles.inputError : ""
          }`}
          required
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries?.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.countryId && (
          <p className={styles.errorMessage}>{errors.countryId}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="cityId" className={styles.label}>
          City
        </label>
        <select
          id="cityId"
          name="cityId"
          value={formData.cityId}
          onChange={handleChange}
          className={`${styles.select} ${
            errors.cityId ? styles.inputError : ""
          }`}
          required
          disabled={!formData.countryId || filteredCities.length === 0}
        >
          <option value="" disabled>
            {formData.countryId ? "Select a city" : "Select a country first"}
          </option>
          {filteredCities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.cityId && (
          <p className={styles.errorMessage}>{errors.cityId}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="location" className={styles.label}>
          Venue / Location
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`${styles.select} ${
            errors.location ? styles.inputError : ""
          }`}
          required
          disabled={!formData.cityId || filteredVenues.length === 0}
        >
          <option value="" disabled>
            {formData.cityId ? "Select a venue" : "Select a city first"}
          </option>
          {filteredVenues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
        {errors.location && (
          <p className={styles.errorMessage}>{errors.location}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="categoryId" className={styles.label}>
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`${styles.select} ${
            errors.categoryId ? styles.inputError : ""
          }`}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className={styles.errorMessage}>{errors.categoryId}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="artist1Id" className={styles.label}>
          Artist 1 (Required)
        </label>
        <select
          id="artist1Id"
          name="artist1Id"
          value={formData.artist1Id}
          onChange={handleChange}
          className={`${styles.select} ${
            errors.artist1Id ? styles.inputError : ""
          }`}
          disabled={!formData.categoryId || filteredArtists.length === 0}
          required
        >
          <option value="">
            {formData.categoryId ? "Select Artist 1" : "Select category first"}
          </option>
          {getAvailableArtistsForSelect().map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        {errors.artist1Id && (
          <p className={styles.errorMessage}>{errors.artist1Id}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="artist2Id" className={styles.label}>
          Artist 2 (Optional)
        </label>
        <select
          id="artist2Id"
          name="artist2Id"
          value={formData.artist2Id}
          onChange={handleChange}
          className={styles.select}
          disabled={
            !formData.artist1Id ||
            getAvailableArtistsForSelect([formData.artist1Id]).length === 0
          }
        >
          <option value="">
            {formData.artist1Id
              ? "Select Artist 2 (Optional)"
              : "Select Artist 1 first"}
          </option>
          {getAvailableArtistsForSelect(
            formData.artist1Id ? [formData.artist1Id] : []
          ).map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="artist3Id" className={styles.label}>
          Artist 3 (Optional)
        </label>
        <select
          id="artist3Id"
          name="artist3Id"
          value={formData.artist3Id}
          onChange={handleChange}
          className={styles.select}
          disabled={
            !formData.artist2Id ||
            getAvailableArtistsForSelect(
              [formData.artist1Id, formData.artist2Id].filter(Boolean)
            ).length === 0
          }
        >
          <option value="">
            {formData.artist2Id
              ? "Select Artist 3 (Optional)"
              : "Select Artist 2 first"}
          </option>
          {getAvailableArtistsForSelect(
            [formData.artist1Id, formData.artist2Id].filter(Boolean)
          ).map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date" className={styles.label}>
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formatDateForInput(formData.date)}
          onChange={handleChange}
          className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
          required
        />
        {errors.date && <p className={styles.errorMessage}>{errors.date}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="startTime" className={styles.label}>
          Start Time
        </label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.startTime ? styles.inputError : ""
          }`}
          required
        />
        {errors.startTime && (
          <p className={styles.errorMessage}>{errors.startTime}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="capacity" className={styles.label}>
          Capacity
        </label>
        <select
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          className={`${styles.select} ${
            errors.capacity ? styles.inputError : ""
          }`}
          required
        >
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>
        {errors.capacity && (
          <p className={styles.errorMessage}>{errors.capacity}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
          required
        />
        {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Short Description (Simple Text)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`${styles.textarea} ${
            errors.description ? styles.inputError : ""
          }`}
          rows="3"
          required
        ></textarea>
        {errors.description && (
          <p className={styles.errorMessage}>{errors.description}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="fullDescription" className={styles.label}>
          Full Description (Simple Text)
        </label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          className={`${styles.textarea} ${
            errors.fullDescription ? styles.inputError : ""
          }`}
          rows="6"
          required
        ></textarea>
        {errors.fullDescription && (
          <p className={styles.errorMessage}>{errors.fullDescription}</p>
        )}
      </div>
      {[1, 2, 3].map((num) => (
        <div className={styles.formGroup} key={`bulletPoint${num}`}>
          <label htmlFor={`bulletPoint${num}`} className={styles.label}>
            Bullet Point {num}
          </label>
          <input
            type="text"
            id={`bulletPoint${num}`}
            name={`bulletPoint${num}`}
            value={formData[`bulletPoint${num}`]}
            onChange={handleChange}
            className={`${styles.input} ${
              errors[`bulletPoint${num}`] ? styles.inputError : ""
            }`}
            required
          />
          {errors[`bulletPoint${num}`] && (
            <p className={styles.errorMessage}>{errors[`bulletPoint${num}`]}</p>
          )}
        </div>
      ))}
      <div className={styles.formGroup}>
        <label htmlFor="imageFile" className={styles.label}>
          Event Image
          <span className={styles.inputHint}>
            (Min: {MIN_IMAGE_WIDTH}x{MIN_IMAGE_HEIGHT}px, 16:9 ratio)
          </span>
        </label>
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
          className={`${styles.input} ${
            errors.imageFile ? styles.inputError : ""
          }`}
          required={!isEditMode || (isEditMode && !imagePreview)}
        />
        {errors.imageFile && (
          <p className={styles.errorMessage}>{errors.imageFile}</p>
        )}
      </div>
      {imagePreview && (
        <div className={styles.imagePreviewContainer}>
          <p className={styles.label}>Image Preview:</p>
          <img
            src={imagePreview}
            alt="Event image preview"
            className={styles.imagePreview}
          />
        </div>
      )}
      {errors.form && <p className={styles.errorMessage}>{errors.form}</p>}
      <div className={styles.formActions}>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isFormSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isFormSubmitting}>
          {isFormSubmitting
            ? "Submitting..."
            : isEditMode
            ? "Update Event"
            : "Add Event"}
        </Button>
      </div>
    </form>
  )
}

export default AddEventForm
