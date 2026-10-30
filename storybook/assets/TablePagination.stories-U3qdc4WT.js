import{T as P}from"./TablePagination-nT_lYFeM.js";import"./iframe-bgo7e1e-.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CabhlhRH.js";import"./index-BgwxsXea.js";import"./Select-hq0-RYLK.js";import"./Button-BsHltkoL.js";import"./utils-JzHJCY_V.js";import"./Label-CxmmfCmf.js";import"./Hidden-DUW6jk9t.js";import"./useFocusRing-DOOJwv5m.js";import"./openLink-CoSKtbHP.js";import"./useLabel--gwqzVgP.js";import"./useLabels-Bim8pLbU.js";import"./number-Du54yJ_D.js";import"./I18nProvider-8UDR-sqk.js";import"./useButton-DHRbxGTd.js";import"./usePress-CGAKik1n.js";import"./textSelection-LFcdZiJl.js";import"./getMetaValue-BiI45Giv.js";import"./useHover-C9083PQk.js";import"./FieldError-CMlcXu_V.js";import"./Text-DJaB50CO.js";import"./Form-3GgSwjy3.js";import"./useFormValidation-DlvMgxhK.js";import"./ListBox-L-Akeuax.js";import"./useCollection-j59lhran.js";import"./keyboard-CofsTAMo.js";import"./FocusScope-DFEKdcB-.js";import"./useEvent-D0SamW91.js";import"./useControlledState-D401CQPw.js";import"./useLoadMoreSentinel-D4EJNrn7.js";import"./Autocomplete-CX9a_7R4.js";import"./useLocalizedStringFormatter-Ddoy7_EZ.js";import"./SelectionIndicator-Dr4s2gbV.js";import"./useListState-CfmtYrGr.js";import"./Dialog-DJM3rWs2.js";import"./Heading-C1h_-W8s.js";import"./useOverlayTriggerState-BqjmD4iR.js";import"./VisuallyHidden-DKLyijvJ.js";import"./animation-BxLvfosO.js";import"./useField-B6TWCboz.js";import"./useFormReset-8GFVl-Zj.js";import"./Input-UoES9vPn.js";import"./SearchField-B_t_og7f.js";import"./useTextField-CEqGEAML.js";import"./useFilter-DbmJvkFb.js";import"./useCollectionAdapter-C9YHTn0r.js";import"./Avatar-DU0Zd8fk.js";import"./Skeleton-DO-gysVk.js";import"./FieldLabel-hSEF8eee.js";import"./FieldError-FiS2FkPv.js";import"./Popover-B7977_xE.js";import"./Text-CkSbbiPb.js";import"./ButtonIcon-DXmg7yM2.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
