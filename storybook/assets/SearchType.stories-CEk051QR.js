import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{d as y}from"./MenuBook-CScUYNaT.js";import{i as S}from"./interopRequireDefault-Y9pwbXtE.js";import{r as V,i as _}from"./createSvgIcon-rCELOQ8q.js";import{r as j}from"./index-CTjT7uj6.js";import{d as g}from"./Person-BAqNXYBV.js";import{S as t}from"./SearchType-D32hEMYY.js";import{s as R,M as A}from"./api-B335RvSG.js";import{S as D}from"./SearchContext-NUeqQOQ4.js";import{S as p}from"./Grid-Cd4CaOSn.js";import{P as I}from"./Paper-BZKq1osr.js";import{T as P}from"./TestApiProvider-4wn3im9M.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./ExpandMore-DJEUZydb.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./translation-BrGRs-hL.js";import"./TranslationApi-DhmNHZQM.js";import"./ApiRef-CqkoWjZn.js";import"./makeStyles-3WuthtJ7.js";import"./Box-BZcLdGyY.js";import"./typography-hVTC7Hfk.js";import"./Typography-CUBppVl0.js";import"./AccordionDetails-dncjf4Z1.js";import"./toArray-QeYAVC82.js";import"./react-is.production.min-D0tnNtx9.js";import"./Collapse-DeBi3gal.js";import"./utils-ClB-4IsE.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./useTheme-hfNS2WFw.js";import"./ButtonBase-C1iu_4vV.js";import"./IconButton-BxJ-nFiT.js";import"./List-BslH4zsa.js";import"./ListContext-DydK1sOh.js";import"./Divider-BRx2RnpI.js";import"./ListItem-CUB3wWpf.js";import"./ListItemIcon-YXvqEhg1.js";import"./ListItemText-CjIJj2RO.js";import"./useTranslationRef-Bfx90Ud1.js";import"./Tabs-oEo5ac4L.js";import"./KeyboardArrowRight-B8I4OV05.js";import"./FormLabel-CJ3FBCjt.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-F4cJWIkJ.js";import"./InputLabel-nTfAEcNe.js";import"./Select-DzWFGM1A.js";import"./Popover-BpMibsVW.js";import"./Modal-CkYXz1UB.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-BcgI5KAA.js";import"./Grow-Bw-3CPgf.js";import"./Chip-Bzt44hdW.js";import"./MenuItem-BJ-7UHOw.js";import"./Checkbox-DdOZMdNd.js";import"./SwitchBase-iczXchsH.js";import"./lodash-CoGan1YB.js";import"./useAnalytics-DVyBXs_0.js";import"./ConfigApi-D1qiBdfc.js";import"./ApiProvider-DlKBPm-W.js";import"./index-BRV0Se7Z.js";var i={},b=S,w=_;Object.defineProperty(i,"__esModule",{value:!0});var T=i.default=void 0,E=w(j),O=b(V()),q=(0,O.default)(E.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");T=i.default=q;const Ze={title:"Plugins/Search/SearchType",component:t,decorators:[x=>e.jsx(P,{apis:[[R,new A]],children:e.jsx(D,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:4,children:e.jsx(x,{})})})})})]},m=["value-1","value-2","value-3"],r=()=>e.jsx(I,{style:{padding:10},children:e.jsx(t,{name:"Search type",values:m,defaultValue:m[0]})}),a=()=>e.jsx(t.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(y,{})},{value:"value-2",name:"Value Two",icon:e.jsx(T,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(t.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});r.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};var s,u,l;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...(l=(u=r.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var n,c,d;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...(d=(c=a.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var v,f,h;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...(h=(f=o.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};const er=["Default","Accordion","Tabs"];export{a as Accordion,r as Default,o as Tabs,er as __namedExportsOrder,Ze as default};
