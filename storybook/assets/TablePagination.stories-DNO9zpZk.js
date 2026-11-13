import{T as P}from"./TablePagination-DUMjrki1.js";import"./iframe-jnmYTFb3.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-FWUTxVt4.js";import"./index-C6hgsZfa.js";import"./Select-D0jh1abN.js";import"./BUIRoutingProvider-D-btTMCD.js";import"./useFocusRing-BdOMpJmy.js";import"./Button-DgXb-SRY.js";import"./utils-CKg7Fv9H.js";import"./Label-B1pLoO_3.js";import"./Hidden-xHEnn_eG.js";import"./useLabel-0FUhOvtV.js";import"./useLabels-BVz1Fy9t.js";import"./number-C6hsbYZL.js";import"./I18nProvider-CZql2cBv.js";import"./useButton-CukdYqmR.js";import"./usePress-0a27YkJt.js";import"./textSelection-BFpEW1JG.js";import"./getMetaValue-vz9tQ4MU.js";import"./useHover-uknbF-p6.js";import"./FieldError-Bb31lOY2.js";import"./Text-Dmw7G-Ih.js";import"./Form-Cx-jaggY.js";import"./useFormValidation-Dh_I7y9w.js";import"./ListBox-D9b_3aJQ.js";import"./useCollection-FCL97-VQ.js";import"./keyboard-BEQ1RQMR.js";import"./FocusScope-BB1H8_4N.js";import"./useEvent-D0OSRjun.js";import"./useControlledState-CrGsVDTu.js";import"./useLoadMoreSentinel-CzOS9T98.js";import"./Autocomplete-BGEL4iKH.js";import"./useLocalizedStringFormatter-DSPB4nHm.js";import"./SelectionIndicator-DQlGQCb5.js";import"./useListState-BIY8hwSl.js";import"./Dialog-CFiC3NsL.js";import"./Heading-CaUyptTa.js";import"./useOverlayTriggerState-B51CCYAg.js";import"./VisuallyHidden-CeTYnCx4.js";import"./animation-CVivYYSw.js";import"./useField-ChuJenZM.js";import"./useFormReset-BqTrmbM5.js";import"./Input-CtX6cgqs.js";import"./SearchField-B3RrXY8R.js";import"./useTextField-CopA5Leg.js";import"./useFilter-CTqGkcG4.js";import"./useCollectionAdapter-QI1P2eya.js";import"./Avatar-BTsfSJMj.js";import"./Skeleton-BbLnkDxy.js";import"./FieldLabel-Bd5j_mRh.js";import"./FieldError-Cdr-d7_s.js";import"./Popover-BmpVM4At.js";import"./Text-BYBX9Ih8.js";import"./ButtonIcon-sVT7F_2-.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
