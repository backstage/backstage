import{T as P}from"./TablePagination-CL8CNAo0.js";import"./iframe-CMKJKLUT.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BuVj0MY8.js";import"./index-DmjMZt5B.js";import"./Select-SwG9poPN.js";import"./Button-D2707XjA.js";import"./utils-CvvRR5aT.js";import"./Label-CdTMbHUG.js";import"./Hidden-yy8u865W.js";import"./useFocusRing-BsrOlbwX.js";import"./openLink-CuYP7gPT.js";import"./useLabel-DYjQeQ13.js";import"./useLabels-s9NhyS06.js";import"./number-BK7i31-5.js";import"./I18nProvider-DNttPEDV.js";import"./useButton-BBt4i9aT.js";import"./usePress-SWIST_DD.js";import"./textSelection-BBT3_o9i.js";import"./useHover-b_v_F8vi.js";import"./FieldError-CCF7VJYp.js";import"./Text-EDMS0XYX.js";import"./useFormValidation-B_x2cwZk.js";import"./ListBox-DnkwV13n.js";import"./useCollection-DnirdA6W.js";import"./keyboard-C7TJsoqE.js";import"./FocusScope-BAx5CJlC.js";import"./useEvent-CYmdv-XJ.js";import"./useControlledState-v_oGfpQe.js";import"./getItemCount-BYLt-gyB.js";import"./Autocomplete-CmhvEYa5.js";import"./useLocalizedStringFormatter-DjHS54sp.js";import"./useListState-Dtk8K3I1.js";import"./Dialog-D6nw_yaU.js";import"./Heading-CLjI2QkE.js";import"./useOverlayTriggerState-gM5yelRW.js";import"./VisuallyHidden-oIRCnDsR.js";import"./animation-UqwXZAR_.js";import"./useField-DLP5oS0R.js";import"./useFormReset-DrwEtMky.js";import"./Input-D5Dwk_-N.js";import"./SearchField-Cwt4HmzI.js";import"./useTextField-BCVN-mBu.js";import"./useFilter-Cd5gPxES.js";import"./useCollectionAdapter-CO_m4FOK.js";import"./Avatar-BlAcSqqL.js";import"./Skeleton-BbKGPT9l.js";import"./FieldLabel-D8kqv_Hs.js";import"./FieldError-xhX5biKf.js";import"./Popover-BfkbnXSG.js";import"./Text-D2qZCCV6.js";import"./ButtonIcon-BmTr9hep.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
