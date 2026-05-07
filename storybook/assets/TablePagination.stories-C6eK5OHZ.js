import{T as P}from"./TablePagination-BW3WdNt1.js";import"./iframe-Cm1o1Xbd.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-wY4oQFtf.js";import"./index-DNR0tEqm.js";import"./Select-CHZuZC7u.js";import"./Dialog-CxqmFqpb.js";import"./Button-DMmduZ0h.js";import"./utils-CjATNJ3m.js";import"./Label-g3yw8owM.js";import"./Hidden-petjBLnB.js";import"./useFocusRing-CoxzC_Ds.js";import"./openLink-D5lxhsMC.js";import"./useLabel-RK6B06Tf.js";import"./useLabels-B2QQzy0Q.js";import"./number-BCqwR3cz.js";import"./I18nProvider-DOJNZcHM.js";import"./useButton-D1PoiJPt.js";import"./usePress-BtwWnSPj.js";import"./textSelection-CF8F-o3W.js";import"./useHover-Dfi0Xo1f.js";import"./Heading-CB08aZDQ.js";import"./useOverlayTriggerState-COMDbRmD.js";import"./useControlledState-CXz-jgZ-.js";import"./useCollection-B0ue3tyF.js";import"./keyboard-BFbUDS0A.js";import"./FocusScope-0OWSHxTh.js";import"./useEvent-BHp8Qbj_.js";import"./Autocomplete-DwY5UQIB.js";import"./useLocalizedStringFormatter-DiF8Cs8o.js";import"./getItemCount-D9Q74GWC.js";import"./Text-BRud69M1.js";import"./VisuallyHidden-78R0k9ze.js";import"./animation-CMkyVwKm.js";import"./FieldError-CHGZLjE9.js";import"./useFormValidation-BwfRfpIx.js";import"./ListBox-CZrSKVXq.js";import"./useListState-DCy7d1Pr.js";import"./useField-CZVexkQR.js";import"./useFormReset-1tnqmoRw.js";import"./definition-D2Q5lHlh.js";import"./Input-CmWiuKh5.js";import"./SearchField-CEe87ttW.js";import"./useTextField-CeeL1WpF.js";import"./useFilter-Dg8ThQpI.js";import"./FieldLabel-vsIACgYY.js";import"./FieldError-CHRFqr7z.js";import"./Text-ChdAxnX2.js";import"./ButtonIcon-_8XR0Xzy.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
