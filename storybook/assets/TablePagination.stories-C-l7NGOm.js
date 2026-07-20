import{T as P}from"./TablePagination-BaSwgpqX.js";import"./iframe-e_Pbc_6f.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DrJIir3F.js";import"./index-D1GUm7TG.js";import"./Select-D7v5bUti.js";import"./Button-D1InRcXf.js";import"./utils-DxA9yzz1.js";import"./Label-C-UeOlhu.js";import"./Hidden-C1Rvfh0a.js";import"./useFocusRing-KWUxPK8x.js";import"./openLink-DeVBsZVT.js";import"./useLabel-DuGYdeVZ.js";import"./useLabels-C5Sb3eQn.js";import"./number-CnABZTeS.js";import"./I18nProvider-CEYf4yN0.js";import"./useButton-B-tc2orz.js";import"./usePress-DUFujYJV.js";import"./textSelection-CmT3bbJB.js";import"./useHover-C40GJDws.js";import"./FieldError-R8gf8j-5.js";import"./Text-kgP67g1L.js";import"./useFormValidation-Dq2pDWRi.js";import"./ListBox-BqHkkENg.js";import"./useCollection-D77l3K3S.js";import"./keyboard-8KwQEgaY.js";import"./FocusScope-DyJjlp03.js";import"./useEvent-CdwABQDt.js";import"./useControlledState-DA3BLMuY.js";import"./getItemCount-D4KD3X2x.js";import"./Autocomplete-FbP99aZV.js";import"./useLocalizedStringFormatter-DiezMxYB.js";import"./useListState-CPlAgzVx.js";import"./Dialog-C-xzIvD4.js";import"./Heading-Boz8J-3b.js";import"./useOverlayTriggerState-CP5VgdLu.js";import"./VisuallyHidden-Cf_DEQs1.js";import"./animation-yDPRJL1t.js";import"./useField-BxXW_0MU.js";import"./useFormReset-BF8qzp5Y.js";import"./Input-D0qkWHrE.js";import"./SearchField--zMKMabY.js";import"./useTextField-BeKMltDD.js";import"./useFilter-CUNITVuy.js";import"./useCollectionAdapter-BFY0211G.js";import"./Avatar-D2oOEPBU.js";import"./Skeleton-DOp3FMBn.js";import"./FieldLabel-B1Pe9T9M.js";import"./FieldError-DxxVTnAm.js";import"./Popover-M-5paRH2.js";import"./Text-uEMQqrD_.js";import"./ButtonIcon-8ef_tIDz.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
