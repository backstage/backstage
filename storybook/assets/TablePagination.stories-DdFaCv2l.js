import{T as P}from"./TablePagination-N0js6yGI.js";import"./iframe-DxBRWUiK.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-VkTcKCoy.js";import"./index-DdTIbfdH.js";import"./Select-BzbuWpJV.js";import"./Button-Dc1PTGgx.js";import"./utils-Cv-9sHfj.js";import"./Label-DB2E6Ibv.js";import"./Hidden-BdHYJNpU.js";import"./useFocusRing-BqPZGEXT.js";import"./openLink-a1B1hwMM.js";import"./useLabel-DFfcinVE.js";import"./useLabels-DXt0FSFN.js";import"./number-CGe6QRer.js";import"./I18nProvider-C0Z_fwek.js";import"./useButton-CoWwmPj-.js";import"./usePress-CsaJDvcb.js";import"./textSelection-BAaw7jcY.js";import"./getMetaValue-CUMJm42D.js";import"./useHover-Cr5thQm_.js";import"./FieldError-BdSj5mJC.js";import"./Text-B4ka2W6z.js";import"./Form-CqE-IOxT.js";import"./useFormValidation-CppbXsgq.js";import"./ListBox-Dg-OCXMR.js";import"./useCollection-BOr2gC9g.js";import"./keyboard-OKXMLejU.js";import"./FocusScope-DCegT4Rn.js";import"./useEvent-CbVpGXN4.js";import"./useControlledState-bDAdDYhT.js";import"./useLoadMoreSentinel-BLBdcP_Q.js";import"./Autocomplete-Cuv0f5M3.js";import"./useLocalizedStringFormatter-DVlYVXvg.js";import"./SelectionIndicator-DUa-TMGu.js";import"./useListState-DIggCB2b.js";import"./Dialog-B1KZGo_M.js";import"./Heading-Czq643nv.js";import"./useOverlayTriggerState-2jFvCPDw.js";import"./VisuallyHidden-CfmB3iy8.js";import"./animation-LN_WEzBA.js";import"./useField-J-UNgQo7.js";import"./useFormReset-DZizIjt8.js";import"./Input-vC6TU_h8.js";import"./SearchField-Dho9Dybl.js";import"./useTextField-CRwhSld1.js";import"./useFilter-DwdIslma.js";import"./useCollectionAdapter-CnTgMnM8.js";import"./Avatar-DY7ywNPJ.js";import"./Skeleton-yKfTnsoe.js";import"./FieldLabel-CJvNbOe0.js";import"./FieldError-CYXXKCAS.js";import"./Popover-D07B5pYz.js";import"./Text-Bl3j3OjI.js";import"./ButtonIcon-C-uXe0cp.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
