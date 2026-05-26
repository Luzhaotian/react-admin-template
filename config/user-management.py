"""
用户管理页面配置
"""

# 类型定义
type_defs = [
    {"dataIndex": "id", "type": "number", "required": True},
    {"dataIndex": "username", "type": "string", "required": True},
    {"dataIndex": "email", "type": "string", "required": True},
    {"dataIndex": "phone", "type": "string"},
    {"dataIndex": "status", "type": "number"},
    {"dataIndex": "createTime", "type": "string"},
    {"dataIndex": "updateTime", "type": "string"},
]

# 搜索字段配置
search_fields = [
    {
        "key": "username",
        "label": "用户名",
        "type": "input",
        "placeholder": "请输入用户名"
    },
    {
        "key": "email",
        "label": "邮箱",
        "type": "input",
        "placeholder": "请输入邮箱"
    },
    {
        "key": "phone",
        "label": "手机号",
        "type": "input",
        "placeholder": "请输入手机号"
    },
    {
        "key": "status",
        "label": "状态",
        "type": "select",
        "options": [
            {"label": "启用", "value": 1},
            {"label": "禁用", "value": 0}
        ],
        "placeholder": "请选择状态"
    },
    {
        "key": "dateRange",
        "label": "创建时间",
        "type": "dateRange",
        "placeholder": ["开始时间", "结束时间"]
    }
]

# 表格列配置
table_columns = [
    {
        "title": "ID",
        "dataIndex": "id",
        "width": 80
    },
    {
        "title": "用户名",
        "dataIndex": "username",
        "width": 120
    },
    {
        "title": "邮箱",
        "dataIndex": "email",
        "width": 200
    },
    {
        "title": "手机号",
        "dataIndex": "phone",
        "width": 150
    },
    {
        "title": "状态",
        "dataIndex": "status",
        "width": 100,
        "render": "(text: number) => text === 1 ? '启用' : '禁用'"
    },
    {
        "title": "创建时间",
        "dataIndex": "createTime",
        "width": 180
    },
    {
        "title": "更新时间",
        "dataIndex": "updateTime",
        "width": 180
    }
]

# API 配置
api_config = {
    "list": "/api/user/list",
    "create": "/api/user/create",
    "update": "/api/user/update",
    "delete": "/api/user/delete",
    "export": "/api/user/export"
}

# 异步 API 配置（用于获取下拉选项）
async_api_config = {
    "name": "getUserOptions",
    "mappings": {
        "channelNameOptions": "channels",
        "nameOptions": "names"
    }
}

# 页面配置
CONFIG = {
    "path": "user-management",
    "title": "用户管理",
    "description": "管理系统用户信息",
    "api": api_config,
    "asyncApi": async_api_config,
    "storeEnum": "user",
    "rowKey": "id",
    "searchFields": search_fields,
    "columns": table_columns,
    "fields": type_defs
}