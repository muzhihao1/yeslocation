/**
 * 真实门店数据
 * 从 yeslocation.html 提取的实际门店信息
 */

export interface RealStore {
  id: number;
  name: string;
  district: string;
  address: string;
  phone: string;
  coordinates: [number, number]; // [latitude, longitude]
  storeNumber: number;
  isHeadquarters?: boolean;
}

export const realStores: RealStore[] = [
  // 呈贡区门店 (6家)
  {
    id: 1,
    name: '耶氏呈贡广场加盟店',
    district: '呈贡区',
    address: '昆明市呈贡区古银路华联超市对面2楼',
    phone: '67454440/67451141',
    coordinates: [24.893498, 102.805662],
    storeNumber: 1
  },
  {
    id: 2,
    name: '耶氏新都会加盟店',
    district: '呈贡区',
    address: '昆明市呈贡区春融街昆百大新都会-1楼',
    phone: '67466746',
    coordinates: [24.897858, 102.852294],
    storeNumber: 2
  },
  {
    id: 3,
    name: '耶氏佳美加盟店',
    district: '呈贡区',
    address: '昆明市呈贡区紫薇街佳美商业广场2楼',
    phone: '64197147',
    coordinates: [24.862403, 102.857425],
    storeNumber: 3
  },
  {
    id: 4,
    name: '耶氏七彩云南加盟店',
    district: '呈贡区',
    address: '昆明市呈贡区上蒜云南第一城-1楼华联超市旁',
    phone: '65939351',
    coordinates: [24.884291, 102.831085],
    storeNumber: 4
  },
  {
    id: 5,
    name: '耶氏雨花广场加盟店',
    district: '呈贡区',
    address: '昆明市呈贡区雨花商业广场1楼',
    phone: '400089147',
    coordinates: [24.842547, 102.849772],
    storeNumber: 5
  },
  {
    id: 6,
    name: '耶氏斗南销售中心',
    district: '呈贡区',
    address: '昆明市呈贡区斗南街道彩龙街世纪城超市旁',
    phone: '67890147',
    coordinates: [24.915558, 102.799904],
    storeNumber: 6
  },
  
  // 五华区门店 (6家)
  {
    id: 7,
    name: '耶氏船房加盟店',
    district: '五华区',
    address: '昆明市五华区船房路船房客运站对面',
    phone: '65411147',
    coordinates: [25.026688, 102.690832],
    storeNumber: 7
  },
  {
    id: 8,
    name: '耶氏船房加盟二店',
    district: '五华区',
    address: '昆明市五华区船房路船房客运站对面',
    phone: '待补充',
    coordinates: [25.026696, 102.691004],
    storeNumber: 8
  },
  {
    id: 9,
    name: '耶氏海源加盟店',
    district: '五华区',
    address: '昆明市五华区海源北路999号星光天地负一楼',
    phone: '待补充',
    coordinates: [25.079094, 102.663835],
    storeNumber: 9
  },
  {
    id: 10,
    name: '耶氏国际派加盟店',
    district: '五华区',
    address: '昆明市五华区商院路昆百大国际派3楼',
    phone: '63114147',
    coordinates: [25.085147, 102.654075],
    storeNumber: 10
  },
  {
    id: 11,
    name: '耶氏国际派2.0加盟店',
    district: '五华区',
    address: '昆明市五华区商院路昆百大国际派3楼',
    phone: '68810588',
    coordinates: [25.085048, 102.654396],
    storeNumber: 11
  },
  {
    id: 12,
    name: '耶氏海屯加盟店',
    district: '五华区',
    address: '昆明市五华区海屯路云师大商学院对面',
    phone: '65656147',
    coordinates: [25.08995, 102.653864],
    storeNumber: 12
  },
  
  // 官渡区门店 (2家)
  {
    id: 13,
    name: '耶氏子君加盟店',
    district: '官渡区',
    address: '昆明市官渡区子君村173号1楼',
    phone: '64647147',
    coordinates: [24.95363, 102.782513],
    storeNumber: 13
  },
  {
    id: 14,
    name: '耶氏体育城加盟总店',
    district: '官渡区',
    address: '昆明市官渡区新亚洲体育城砖瓦厂国际3楼',
    phone: '65655147',
    coordinates: [24.952622, 102.773629],
    storeNumber: 14,
    isHeadquarters: true
  },
  
  // 盘龙区门店 (2家)
  {
    id: 15,
    name: '耶氏新迎加盟店',
    district: '盘龙区',
    address: '昆明市盘龙区田园路森林酒吧楼上',
    phone: '64641147',
    coordinates: [25.056486, 102.744412],
    storeNumber: 15
  },
  {
    id: 16,
    name: '耶氏西南林大加盟店',
    district: '盘龙区',
    address: '昆明市盘龙区迎溪村昆华路196号2楼',
    phone: '64137147',
    coordinates: [25.058366, 102.75418],
    storeNumber: 16
  },
  
  // 晋宁区门店 (3家)
  {
    id: 17,
    name: '耶氏昆阳加盟店',
    district: '晋宁区',
    address: '昆明市晋宁区清河路东门小区475号2楼',
    phone: '67888147',
    coordinates: [24.668371, 102.600876],
    storeNumber: 17
  },
  {
    id: 18,
    name: '耶氏昆阳春晖路加盟店',
    district: '晋宁区',
    address: '昆明市晋宁区春晖路33号苏宁易购3楼',
    phone: '64645147',
    coordinates: [24.667413, 102.599722],
    storeNumber: 18
  },
  {
    id: 19,
    name: '耶氏晋城加盟店',
    district: '晋宁区',
    address: '昆明市晋宁区晋城龙羊烧烤城2楼',
    phone: '67450147',
    coordinates: [24.71113, 102.755883],
    storeNumber: 19
  },
  
  // 澄江市门店 (1家)
  {
    id: 20,
    name: '耶氏澄江加盟店',
    district: '澄江市',
    address: '云南省玉溪市澄江市环城西路90号老仓库来线原墨院内二楼',
    phone: '待补充',
    coordinates: [24.673471, 102.913476],
    storeNumber: 20
  }
];

// 获取所有区域列表
export const getDistricts = (): string[] => {
  return [...new Set(realStores.map(store => store.district))];
};

// 根据区域获取门店
export const getStoresByDistrict = (district: string): RealStore[] => {
  return realStores.filter(store => store.district === district);
};

// 获取总店信息
export const getHeadquarters = (): RealStore | undefined => {
  return realStores.find(store => store.isHeadquarters);
};