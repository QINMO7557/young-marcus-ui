export const Schema = z.object({
  世界: z
    .object({
      主线: z.enum(['家里线', '大学线', '自定义']).prefault('大学线'),
      家里线子路线: z.enum(['社区学院', '工作', '无']).prefault('无'),
      专业: z.string().prefault('未定专业'),
      开局描述摘要: z.string().prefault(''),
      日期: z.string().prefault('9/1'),
      星期: z.enum(['周一', '周二', '周三', '周四', '周五', '周六', '周日']).prefault('周一'),
      时段: z.enum(['清晨', '上午', '中午', '下午', '傍晚', '晚上', '深夜']).prefault('上午'),
      时刻: z.string().prefault('08:00'),
      季节: z.enum(['春', '夏', '秋', '冬']).prefault('秋'),
      天气: z.enum(['晴', '多云', '阴', '小雨', '暴雨', '小雪', '大雪', '雾', '大风']).prefault('晴'),
      学期阶段: z
        .enum(['秋季学期', '期中周', '期末周', '感恩节假', '寒假', '春季学期', '春假', '暑假', '自定义假期'])
        .prefault('秋季学期'),
      当前区域: z.enum(['家附近', '大学城', '外出', '远行', '旅途']).prefault('大学城'),
      当前地点: z.string().prefault('宿舍'),
      今日状况: z.string().prefault(''),
    })
    .prefault({
      主线: '大学线',
      家里线子路线: '无',
      专业: '未定专业',
      开局描述摘要: '',
      日期: '9/1',
      星期: '周一',
      时段: '上午',
      时刻: '08:00',
      季节: '秋',
      天气: '晴',
      学期阶段: '秋季学期',
      当前区域: '大学城',
      当前地点: '宿舍',
      今日状况: '',
    }),
  主角: z
    .object({
      姓名: z.string().prefault('Marcus'),
      年龄: z.coerce.number().transform(value => Math.max(18, Math.floor(value))).prefault(18),
      身高: z.string().prefault('175 cm'),
      体型: z
        .enum(['瘦弱', '偏瘦', '正常', '薄肌', '结实', '壮', '肌肉发达', '偏胖', '壮实成熟'])
        .prefault('正常'),
      体型备注: z.string().prefault(''),
      外貌: z.string().prefault(''),
      爱好: z
        .array(z.string())
        .transform(value => value.filter(Boolean).slice(0, 3))
        .prefault([]),
      喜欢的类型: z.string().prefault(''),
      性格: z.string().prefault(''),
      自述: z.string().prefault(''),
      身份: z.string().prefault('霍大大一'),
      专业: z.string().prefault('未定专业'),
      金钱: z.coerce.number().transform(value => Math.min(99999, Math.max(0, value))).prefault(100),
      体力: z
        .object({
          当前: z.coerce.number().transform(value => Math.min(999, Math.max(0, value))).prefault(100),
          上限: z.coerce.number().transform(value => Math.min(999, Math.max(1, value))).prefault(100),
        })
        .transform(data => ({
          上限: data.上限,
          当前: Math.min(data.上限, Math.max(0, data.当前)),
        }))
        .prefault({ 当前: 100, 上限: 100 }),
      魅力: z.coerce.number().transform(value => Math.min(100, Math.max(0, value))).prefault(21),
      智力: z.coerce.number().transform(value => Math.min(100, Math.max(0, value))).prefault(20),
      体能: z.coerce.number().transform(value => Math.min(100, Math.max(0, value))).prefault(20),
      堕落度: z.coerce.number().transform(value => Math.min(100, Math.max(0, value))).prefault(0),
    })
    .prefault({
      姓名: 'Marcus',
      年龄: 18,
      身高: '175 cm',
      体型: '正常',
      体型备注: '',
      外貌: '',
      爱好: [],
      喜欢的类型: '',
      性格: '',
      自述: '',
      身份: '霍大大一',
      专业: '未定专业',
      金钱: 100,
      体力: { 当前: 100, 上限: 100 },
      魅力: 21,
      智力: 20,
      体能: 20,
      堕落度: 0,
    }),
  日程: z
    .object({
      课表: z
        .partialRecord(
          z.enum(['周一', '周二', '周三', '周四', '周五', '周六', '周日']),
          z.record(
            z.string().describe('课程名'),
            z
              .object({
                开始时刻: z.string().prefault(''),
                时长分钟: z.coerce.number().transform(value => Math.min(480, Math.max(0, value))).prefault(50),
                地点: z.string().prefault(''),
                教师: z.string().prefault(''),
              })
              .prefault({ 开始时刻: '', 时长分钟: 50, 地点: '', 教师: '' }),
          ),
        )
        .prefault({}),
      今日日程: z
        .record(
          z.string().describe('事项'),
          z
            .object({
              时间: z.string().prefault(''),
              内容: z.string().prefault(''),
              地点: z.string().prefault(''),
              是否完成: z.boolean().prefault(false),
            })
            .prefault({ 时间: '', 内容: '', 地点: '', 是否完成: false }),
        )
        .prefault({}),
      兼职岗位: z.string().prefault('无'),
      室友选择: z.enum(['Christian', 'Marky', '自定义']).prefault('Christian'),
      自定义室友: z
        .object({
          年级: z.string().prefault(''),
          身份: z.string().prefault(''),
          体型: z.string().prefault(''),
          气质: z.string().prefault(''),
          取向: z.string().prefault(''),
          性格: z.array(z.string()).prefault([]),
          社团: z.string().prefault(''),
          外貌关键词: z.string().prefault(''),
          一句话: z.string().prefault(''),
        })
        .prefault({
          年级: '',
          身份: '',
          体型: '',
          气质: '',
          取向: '',
          性格: [],
          社团: '',
          外貌关键词: '',
          一句话: '',
        }),
      宿舍: z
        .object({
          房型: z.enum(['单人', '双人', '四人', '八人']).prefault('双人'),
          寝室类型: z.string().prefault('混合'),
          氛围: z.string().prefault(''),
          带路人数: z.coerce.number().transform(value => Math.min(20, Math.max(0, Math.floor(value)))).prefault(0),
        })
        .prefault({ 房型: '双人', 寝室类型: '混合', 氛围: '', 带路人数: 0 }),
    })
    .prefault({
      课表: {},
      今日日程: {},
      兼职岗位: '无',
      室友选择: 'Christian',
      自定义室友: {
        年级: '',
        身份: '',
        体型: '',
        气质: '',
        取向: '',
        性格: [],
        社团: '',
        外貌关键词: '',
        一句话: '',
      },
      宿舍: { 房型: '双人', 寝室类型: '混合', 氛围: '', 带路人数: 0 },
    }),
  重要人物: z
    .record(
      z.string().describe('名字'),
      z
        .object({
          身份: z.string().prefault(''),
          关系: z.string().prefault(''),
          好感: z.coerce.number().transform(value => Math.min(100, Math.max(0, value))).prefault(0),
          外貌: z.string().prefault(''),
          性格: z.string().prefault(''),
          爱好: z.string().prefault(''),
          常去地点: z.string().prefault(''),
          工作地点: z.string().prefault(''),
          家庭住址: z.string().prefault(''),
          对你态度: z.enum(['冷淡', '普通', '在意', '感兴趣']).prefault('普通'),
          关系意向: z.enum(['可攻略', '仅朋友']).prefault('可攻略'),
          日常互动计数: z.coerce
            .number()
            .transform(value => Math.min(5, Math.max(0, Math.floor(value))))
            .prefault(0),
          当前状态: z.string().prefault(''),
          约定: z.record(z.string().describe('约定名'), z.string()).prefault({}),
          来源: z.string().prefault(''),
        })
        .prefault({
          身份: '',
          关系: '',
          好感: 0,
          外貌: '',
          性格: '',
          爱好: '',
          常去地点: '',
          工作地点: '',
          家庭住址: '',
          对你态度: '普通',
          关系意向: '可攻略',
          日常互动计数: 0,
          当前状态: '',
          约定: {},
          来源: '',
        }),
    )
    .prefault({}),
  道具: z
    .record(
      z.string().describe('物品名'),
      z
        .object({
          说明: z.string().prefault(''),
          数量: z.coerce.number().transform(value => Math.max(0, Math.floor(value))).prefault(1),
        })
        .prefault({ 说明: '', 数量: 1 }),
    )
    .prefault({}),
  地图解锁: z
    .object({
      外出: z.record(z.string().describe('地点名'), z.string()).prefault({}),
      远行: z.record(z.string().describe('地点名'), z.string()).prefault({}),
      旅途: z
        .record(
          z.string().describe('城市名'),
          z
            .object({
              季节或时间: z.string().prefault(''),
              备忘: z.string().prefault(''),
            })
            .prefault({ 季节或时间: '', 备忘: '' }),
        )
        .prefault({}),
    })
    .prefault({ 外出: {}, 远行: {}, 旅途: {} }),
  升格候选: z
    .record(
      z.string().describe('称呼'),
      z
        .object({
          地点: z.string().prefault(''),
          互动次数: z.coerce.number().transform(value => Math.max(0, Math.floor(value))).prefault(0),
          最近出现: z.string().prefault(''),
        })
        .prefault({ 地点: '', 互动次数: 0, 最近出现: '' }),
    )
    .transform(data => Object.fromEntries(Object.entries(data).slice(-5)))
    .prefault({}),
});
export type Schema = z.infer<typeof Schema>;
