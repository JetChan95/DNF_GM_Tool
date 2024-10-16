#= require ../common/index

class Index extends Common
  constructor: () ->
    super()
    @table = layui.table
    @datas = []
  init: () ->
    super()
    @tableRender()

    $(document).on 'click', '.js-delete', (event) => @removeHandle(event)

    $(document).on 'click', '.js-search-btn', @search
      
    $(document).on 'click', '.js-show', -> layer.msg "功能开发中"
        
    $(document).on 'click', '.js-login', (event) => @login event

    $(document).on 'click', '.js-vip', (event) => @giveVip(event)

  tableRender: () ->
    @table.render
      elem: '#account_table'
      url: '/account/list'
      page: true
      cols: [[
        {
          field: 'UID'
          title: 'UID',
        },
        {
          field: 'accountname'
          title: '账号'
        },
        {
          field: 'type'
          title: '权限'
          templet: (i) ->
            if i.VIP is "GM_master"
              return "GM"
            if i.VIP is "GM_vip"
              return "VIP"
            if i.VIP is "" or not i.VIP
              return "普通"
        },
        {
          title: '操作',
          toolbar: '#toolbar'
        },
      ]]
      done: (res) =>
        @datas = res.data
        
  
  removeHandle: (event) -> 
    _index = $(event.target).parents('tr').attr('data-index')
    layer.confirm "是否删除账号?", (index) => 
      uid = @datas[_index].UID
      load = layer.load(2)
      layer.close index
      $.ajax
        type: "delete"
        url: "/account"
        data: "uid=#{uid}"
        success: (res) ->
          layer.closeAll()
          if res.code is 200
            layer.msg res.msg, icon: 1
            layui.table.reload("account_table")
          else if res.code is -1
            layer.msg res.msg, icon: 2

  search: () ->
    account = $('.js-account').val()
    layui.table.reload "account_table",
      where:
        account: account 
    
  login: (event) -> 
    index = $(event.target).parents('tr').attr('data-index')
    uid = @datas[index].UID
    layer.confirm "是否登录此账号操作？", (layero) ->
      datas = 
        uid: uid
      $.get '/check_account', datas, (res) ->
        if res.code is 200
          return location.href = ""
        layer.msg res.msg

  giveVip: (event) -> 
    _index = $(event.target).parents('tr').attr('data-index')
    layer.confirm "是否升级VIP?", (index) => 
      uid = @datas[_index].UID
      load = layer.load(2)
      layer.close index
      datas = 
        uid: uid
      $.get '/vip/give', datas, (res) ->
          layer.closeAll()
          console.log(res)
          if res.code is 200
            layer.msg res.msg, icon: 1
            layui.table.reload("account_table")
          else if res.code is -1
            layer.msg res.msg, icon: 2
i = new Index
i.init()