import{T as P}from"./TablePagination-Cm-ev10i.js";import"./iframe-CBMR_Zns.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Di5USI_f.js";import"./index-CSl2mkg1.js";import"./Select-BcNr6lf9.js";import"./Dialog-6YF3eN5L.js";import"./Button-CM2dopB3.js";import"./utils-rWtpR1MY.js";import"./Label-DuWyQp2g.js";import"./Hidden-BglMmnJ5.js";import"./useFocusRing-BuESkXex.js";import"./openLink-ChAauiNp.js";import"./useLabel-n2lyhJGF.js";import"./useLabels-FTexz-tp.js";import"./number-CXYyyh8K.js";import"./I18nProvider-oR5Ja0wv.js";import"./useButton-RAni5jNL.js";import"./usePress-DhxYfhpF.js";import"./textSelection-BkXItJcf.js";import"./useHover-DV1SrM-M.js";import"./Heading-CUw3A6Iw.js";import"./useOverlayTriggerState-BDCFMBN8.js";import"./useControlledState-BBcQwN-x.js";import"./useCollection-BX11QxCw.js";import"./keyboard-AwonMwIP.js";import"./FocusScope-DWUPhYMj.js";import"./useEvent-Djna0NQy.js";import"./Autocomplete-zMjsw1_l.js";import"./useLocalizedStringFormatter-mRejZbIc.js";import"./getItemCount-BvqnhK0d.js";import"./Text-IHK4rpmW.js";import"./VisuallyHidden-VG3tdw8m.js";import"./animation-azhfMAtA.js";import"./FieldError-ZI6tW-Lc.js";import"./useFormValidation-m6j0Nnl-.js";import"./ListBox-DONBEeFU.js";import"./useListState-BKvUgQH8.js";import"./useField-27slMnwn.js";import"./useFormReset-C2xCdz2X.js";import"./definition-CL0Fd2xg.js";import"./Input-Ux0Kt_0Q.js";import"./SearchField-YA7NZihz.js";import"./useTextField-ZzRq5ejF.js";import"./useFilter--7WaZ1EF.js";import"./FieldLabel-oB1n8Urz.js";import"./FieldError-CUC6OGGE.js";import"./Text-njpP_Mb-.js";import"./ButtonIcon-BeDi_e8W.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
