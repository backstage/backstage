import{T as P}from"./TablePagination-DqQ_vQLf.js";import"./iframe-psIK5yLO.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-JQhcLLWe.js";import"./index-Co8i19eP.js";import"./Select-CDjhnoOn.js";import"./Button-DCPejbPh.js";import"./utils-CftV7EFJ.js";import"./Label-ChcPP0Iy.js";import"./Hidden-EyJpXoDf.js";import"./useFocusRing-MLrPTLpZ.js";import"./openLink-CZeZ1U9d.js";import"./useLabel-C2F-sL7S.js";import"./useLabels-F6gridtO.js";import"./number-DZFckd1I.js";import"./I18nProvider-NMyyBc2c.js";import"./useButton-CXcOFXh4.js";import"./usePress-Bjjm_ouf.js";import"./textSelection-Df_eiIv9.js";import"./getMetaValue-Cq3cpixi.js";import"./useHover-B93NGpPn.js";import"./FieldError-C-_S2X_i.js";import"./Text-MXkBOzgj.js";import"./Form-Bxro-USV.js";import"./useFormValidation-DCSuHTe1.js";import"./ListBox-DyEXVxzX.js";import"./useCollection-BxTIozKT.js";import"./keyboard-BylIjWir.js";import"./FocusScope-BaF3dqfB.js";import"./useEvent-CPLuyflN.js";import"./useControlledState-vYZGCggF.js";import"./useLoadMoreSentinel-BHlrtKZc.js";import"./Autocomplete-BZz0XNI4.js";import"./useLocalizedStringFormatter-B5sY9Tzc.js";import"./SelectionIndicator-6G0ubX2B.js";import"./useListState-DBlYMvZ2.js";import"./Dialog-DWTbBm9n.js";import"./Heading-DjGVTQwT.js";import"./useOverlayTriggerState-qoSrz_6x.js";import"./VisuallyHidden-DE3pxJfo.js";import"./animation-BSlcDtlM.js";import"./useField-CEbJoclW.js";import"./useFormReset-B7JhnxRP.js";import"./Input-DlLNH5sR.js";import"./SearchField-B95InfVr.js";import"./useTextField-BjCw99mH.js";import"./useFilter-BZbDJEfE.js";import"./useCollectionAdapter-BBrZkcm5.js";import"./Avatar-Dhb_OC6c.js";import"./Skeleton-qTBL_tFL.js";import"./FieldLabel-CGDhkbg2.js";import"./FieldError-QiIs_lDl.js";import"./Popover-RoyRacTd.js";import"./Text-DOm5LIYn.js";import"./ButtonIcon-DKFtXmkR.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
