package com.course.common;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页响应对象
 */
@Data
public class PageResult<T> implements Serializable {
    private List<T> records;
    private Long total;
    private Integer page;
    private Integer size;
    private Long pages;

    public PageResult() {
    }

    public PageResult(List<T> records, Long total, Integer page, Integer size) {
        this.records = records;
        this.total = total;
        this.page = page;
        this.size = size;
        this.pages = (total + size - 1) / size;
    }

    public static <T> PageResult<T> of(List<T> records, Long total, Integer page, Integer size) {
        return new PageResult<>(records, total, page, size);
    }
}
