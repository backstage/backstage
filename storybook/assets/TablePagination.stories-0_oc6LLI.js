import{T as P}from"./TablePagination-CWldgEdX.js";import"./iframe-CdNUyns1.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CFuPSG1M.js";import"./index-C5_u8aRu.js";import"./Select-CDz0txMT.js";import"./Button-Cb98tIb7.js";import"./utils-B3O2Yp_M.js";import"./Label-D16an-mE.js";import"./Hidden-CS8th6sD.js";import"./useFocusRing-BuKVGuQV.js";import"./openLink-DihNKPlJ.js";import"./useLabel-BERv6pEw.js";import"./useLabels-uizblfZx.js";import"./number-CzhiuJx7.js";import"./I18nProvider-B6FBVrT9.js";import"./useButton-BtcENp-V.js";import"./usePress-_7EGmIU1.js";import"./textSelection-SXrH1sR5.js";import"./useHover-Cn5cU9qj.js";import"./FieldError-CdWPta5W.js";import"./Text-CYsN3RIY.js";import"./useFormValidation-DRFEp6qp.js";import"./ListBox-B_d110hq.js";import"./useCollection-lN1Q5AFU.js";import"./keyboard-DKfMEpD_.js";import"./FocusScope-BGoJKhy8.js";import"./useEvent-CUxtDg7f.js";import"./useControlledState-BN5fLvZ3.js";import"./getItemCount-ZzIrozYJ.js";import"./Autocomplete-BkQbc6kZ.js";import"./useLocalizedStringFormatter-qf--bxfb.js";import"./useListState-736NwSrE.js";import"./Dialog-MeAFG64o.js";import"./Heading-CslegC5L.js";import"./useOverlayTriggerState-CxgiGkff.js";import"./VisuallyHidden-B5fHw0hs.js";import"./animation-Dtm5YrM0.js";import"./useField-CmzNUn8V.js";import"./useFormReset-BRZSsq_e.js";import"./Input-CfbbQHzS.js";import"./SearchField-DaycyAjt.js";import"./useTextField-CRnA5sL5.js";import"./useFilter-C3vSSGtB.js";import"./useCollectionAdapter-BZWlqVYb.js";import"./Avatar-CwET3TVw.js";import"./Skeleton-CA3ocMqB.js";import"./FieldLabel-DilSbrpL.js";import"./FieldError-Bw1EKFCf.js";import"./Popover-BOSdb0Hx.js";import"./Text-FxBj8Ix2.js";import"./ButtonIcon-ZRgf0k-E.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
