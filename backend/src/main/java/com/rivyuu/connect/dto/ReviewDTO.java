package com.rivyuu.connect.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class ReviewDTO {
    @NotBlank
    private String businessId;

    @Min(1) @Max(5)
    private Integer rating;

    @NotBlank @Size(max = 100)
    private String title;

    @NotBlank @Size(min = 20, max = 1000)
    private String content;

    private List<String> tags;
}
