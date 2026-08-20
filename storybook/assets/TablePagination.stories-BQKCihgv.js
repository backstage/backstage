import{T as P}from"./TablePagination-MJ43nGPT.js";import"./iframe-BHoENCVc.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-uSeYP5xn.js";import"./index-CXAyTdUW.js";import"./Select-DyjX-Ajz.js";import"./Button-BHRDpgL_.js";import"./utils-CL0Z8V1C.js";import"./Label-DlD4XAby.js";import"./Hidden-C6_e4Tzz.js";import"./useFocusRing-MHb5XFUp.js";import"./openLink-DZP0UHC7.js";import"./useLabel-DLz-9M9H.js";import"./useLabels-Dx4Y77vh.js";import"./number-CnfK_WTv.js";import"./I18nProvider-BHwrJH4v.js";import"./useButton-DPa3LWsd.js";import"./usePress-D96lUmWf.js";import"./textSelection-Di8U28Mz.js";import"./useHover-CPCQZiGU.js";import"./FieldError-ByCYa549.js";import"./Text-C8x2cVH5.js";import"./useFormValidation-BwtogCRU.js";import"./ListBox-A5L7mExS.js";import"./useCollection-CvCJeEFX.js";import"./keyboard-CQek5qZh.js";import"./FocusScope-9n4xhBQA.js";import"./useEvent-CcBfYwbm.js";import"./useControlledState--Wz_vfvx.js";import"./getItemCount-CZxrPbgG.js";import"./Autocomplete-Bgw_Gpoz.js";import"./useLocalizedStringFormatter-BaNttnCu.js";import"./useListState-vDCPlgz-.js";import"./Dialog-Dl2D-CV-.js";import"./Heading-BT5dE8Rd.js";import"./useOverlayTriggerState-Cx2c-3-p.js";import"./VisuallyHidden-q8nayOEv.js";import"./animation-D48GeWFv.js";import"./useField-DUlTbCPt.js";import"./useFormReset-lwOM45Sr.js";import"./Input-BO0IQHQF.js";import"./SearchField-D81loRcG.js";import"./useTextField-DggYGt4Z.js";import"./useFilter-L39FFgK3.js";import"./useCollectionAdapter-BnjT3HNi.js";import"./Avatar-CeUojz6K.js";import"./Skeleton-Cy2vHnkS.js";import"./FieldLabel-Dvq-CEbN.js";import"./FieldError-B3gpmbxK.js";import"./Popover-Cngzbhp4.js";import"./Text-s-AhUfle.js";import"./ButtonIcon-Dbucn7ko.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
