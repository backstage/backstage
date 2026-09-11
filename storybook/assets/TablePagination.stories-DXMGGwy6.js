import{T as P}from"./TablePagination-B8pxFF6l.js";import"./iframe-JPiukB_R.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DXVQTGA8.js";import"./index-DFKLNzc2.js";import"./Select-Bn5JF-eP.js";import"./Button-DEJ5jMKU.js";import"./utils-DDi5xxmN.js";import"./Label-IokeRjbO.js";import"./Hidden-B-d7XQtl.js";import"./useFocusRing-DaX8_kMK.js";import"./openLink-0QZlDlxj.js";import"./useLabel-D_mWupuI.js";import"./useLabels-NEKiuqWd.js";import"./number-G04hMwQn.js";import"./I18nProvider-DFp_bXrB.js";import"./useButton-CuUkU0tZ.js";import"./usePress-BL8d4Qht.js";import"./textSelection-DFCD4j4A.js";import"./useHover-BNLW-94k.js";import"./FieldError-CIAC_u_D.js";import"./Text-D1sILF3o.js";import"./useFormValidation-DY4ZlP36.js";import"./ListBox-VVkgYUYK.js";import"./useCollection-DIbzle1l.js";import"./keyboard-DE38zrnp.js";import"./FocusScope-9aUIRnvL.js";import"./useEvent-BnHE3X8m.js";import"./useControlledState-BQx1jdRH.js";import"./getItemCount-DBXp33SO.js";import"./Autocomplete-0FuprScb.js";import"./useLocalizedStringFormatter-CtZkUal3.js";import"./useListState-kRwx-MKu.js";import"./Dialog-DRcxXFrw.js";import"./Heading-CTTW_TQO.js";import"./useOverlayTriggerState-D8Agx5ZP.js";import"./VisuallyHidden-Cwyoj3Cn.js";import"./animation-0YAkd_Wy.js";import"./useField-UvHv0-tI.js";import"./useFormReset-BZnw3Fbe.js";import"./Input-zgYq2BzY.js";import"./SearchField-BCCWFtk1.js";import"./useTextField-DnRlJLXB.js";import"./useFilter-BEAT9qGP.js";import"./useCollectionAdapter-CUwiYx2N.js";import"./Avatar-CCNikqto.js";import"./Skeleton-DoSOs9Va.js";import"./FieldLabel-Diznczn3.js";import"./FieldError-Dwk4cM_f.js";import"./Popover-D0tLeoBU.js";import"./Text-D0uRsaTu.js";import"./ButtonIcon-DQjFZlPD.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
