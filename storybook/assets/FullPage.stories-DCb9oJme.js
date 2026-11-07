import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-D9zyyCLm.js";import{P as l}from"./PluginHeader-BQTnlTrc.js";import{C as p}from"./Container-BG5O_iUQ.js";import{T as t}from"./Text-CgjLIcL_.js";import{B as j}from"./BUIProvider-CorbBPd2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BJpHCwC2.js";import"./utils-BhB9Kn0J.js";import"./useObjectRef-DW2A_FKT.js";import"./useCollection-B26EPvJy.js";import"./useFocusRing-Cyv4kXD7.js";import"./openLink-Dq3aE_9q.js";import"./Hidden-BEbPYnKb.js";import"./keyboard-DCFt_Vdh.js";import"./getMetaValue-DvVIc-fc.js";import"./FocusScope-lLzncA3g.js";import"./useEvent-CgIHwaqr.js";import"./I18nProvider-CFA5Nn83.js";import"./usePress-DakPojsx.js";import"./textSelection-B_folLqx.js";import"./useControlledState-CNVQPQl6.js";import"./Link-CrETciSf.js";import"./useLink-B2hTr1Or.js";import"./useHover-CXer1LBh.js";import"./useLocalizedStringFormatter-Cws02Rph.js";import"./Button-eiFaSVQp.js";import"./Label-8xCw--Gh.js";import"./useLabel-CNCvRjXr.js";import"./useLabels-Cf60hIuc.js";import"./number-oRZks6E2.js";import"./useButton-Br280P7j.js";import"./Menu-CQeWkge2.js";import"./Autocomplete-y5aAoPrH.js";import"./useLoadMoreSentinel-CSmiezNk.js";import"./Input-HAwV3UgY.js";import"./ListBox-CLfyKQ5P.js";import"./SelectionIndicator-DYFHwb90.js";import"./Text-DyJll7O5.js";import"./useListState-DNv1jxCo.js";import"./Dialog-B4rjAWyQ.js";import"./Heading-B3QLbIIh.js";import"./useOverlayTriggerState-BkEw8wth.js";import"./VisuallyHidden-k2mNg0ke.js";import"./animation-Dc2F1pm8.js";import"./SearchField-BIwjR7hY.js";import"./FieldError-PBAfGMRH.js";import"./Form-BKc8ubiD.js";import"./useFormValidation-DU6bMNno.js";import"./useTextField-CnV1bkF2.js";import"./useField-BFVTHaKM.js";import"./useFormReset-fb_8OtZl.js";import"./Virtualizer-B6YG3lYk.js";import"./useFilter-HAVuwduG.js";import"./getNodeText-DKIdVNID.js";import"./Link-DZ17BmAx.js";import"./useResolvedHref-CJObg6YS.js";import"./Tooltip-BhAvVrKz.js";import"./VisuallyHidden-DQZkBOu3.js";import"./Tabs-DyHdiEHo.js";import"./useHasTabbableChild-qIq5_-ZX.js";import"./BUIRoutingProvider-CWnqyVtP.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
