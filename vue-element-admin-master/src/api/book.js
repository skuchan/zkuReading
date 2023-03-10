import request from '@/utils/request'

export function createBook(book){
  return request({
    url:'/book/create',
    method:'post',
    data:book
  })
}

export function updateBook(book){
  return request({
    url:'/book/update',
    method:'post',
    data:book
  })
}


export function getBook(fileName){
  return request({
    url:'/book/get',
    methods:'get',
    params:{fileName}
  })
}

export function getCategory(){
  return request({
    url:'/book/category',
    methods:'get',
  })
}

export function listBook(params){
  return request({
    url:'/book/list',
    methods:'get',
    params
  })
}

export function deleteBook(fileName){
  return request({
     url:'/book/delete',
     method:'get',
     params:{fileName}
  })
}



