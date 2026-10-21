import{T as P}from"./TablePagination-k7NWptBX.js";import"./iframe-CSz7VfT3.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-D_q6rl-C.js";import"./index-ndNk04vF.js";import"./Select-B2A4LZ3F.js";import"./Button-Be0Cy88V.js";import"./utils-DO510V5r.js";import"./Label-AZq59z2_.js";import"./Hidden-CM7FbOlL.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./useLabel-B7GfVGDS.js";import"./useLabels-53H5tn1J.js";import"./number-vPK-eftY.js";import"./I18nProvider-C8LosUml.js";import"./useButton-0UwCDxtn.js";import"./usePress-BkOB3jXf.js";import"./textSelection-xDV9V9Np.js";import"./getMetaValue-C_A1bvat.js";import"./useHover-C4tPk2eu.js";import"./FieldError-D30XUBdE.js";import"./Text-M5JE05Z1.js";import"./Form-DCmzyXZg.js";import"./useFormValidation-BaS-Dz0q.js";import"./ListBox-zKNf2tM4.js";import"./useCollection-BRMINt-w.js";import"./keyboard-Bg9gEdpU.js";import"./FocusScope-q3DFSEE5.js";import"./useEvent-B1v68yyd.js";import"./useControlledState-D9BG_cB_.js";import"./useLoadMoreSentinel-D4Tl_mKJ.js";import"./Autocomplete-__qsaNuQ.js";import"./useLocalizedStringFormatter-C142jinZ.js";import"./SelectionIndicator-D0yCXn87.js";import"./useListState-Bb8eRarH.js";import"./Dialog-rSqyM-23.js";import"./Heading-tcCPkFfK.js";import"./useOverlayTriggerState-BU4FYN95.js";import"./VisuallyHidden-BSkWTXCt.js";import"./animation-CNMihT0b.js";import"./useField-CqcWBy83.js";import"./useFormReset-9iV2nQ5O.js";import"./Input-rX87b3KQ.js";import"./SearchField-B0js2RMr.js";import"./useTextField-B5NRQ6t7.js";import"./useFilter-CmszS9mf.js";import"./useCollectionAdapter-wFajUIxc.js";import"./Avatar-BZrBorqt.js";import"./Skeleton-DlPdknf9.js";import"./FieldLabel-CDrDTVuE.js";import"./FieldError-BvVX8wrc.js";import"./Popover-AhDVu23m.js";import"./Text-Cq25VfyC.js";import"./ButtonIcon-C7S555RE.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
