import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-CMSX-Slv.js";import{P as l}from"./PluginHeader-2O5WOgUJ.js";import{C as p}from"./Container-C_JMwQXl.js";import{T as t}from"./Text-C7y2DDeV.js";import{B as j}from"./BUIProvider-rCuBO32v.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DnnZFGoL.js";import"./utils-lN068qtb.js";import"./useObjectRef-BtQagX3Q.js";import"./useCollection-C55LZDbY.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./Hidden-kIQntXwy.js";import"./keyboard-DZQobsnO.js";import"./getMetaValue-DyXwXlFD.js";import"./FocusScope-hnaFZs9t.js";import"./useEvent-BikmhAJg.js";import"./I18nProvider-B2rLmNuT.js";import"./usePress-BzSNyydx.js";import"./textSelection-CwsB_5f_.js";import"./useControlledState-DUMTY9Yj.js";import"./Link-DRGUXBWJ.js";import"./useLink-wIHaApio.js";import"./useHover-D7owYt-e.js";import"./useLocalizedStringFormatter-DNWACNIN.js";import"./Button-C89HVwFt.js";import"./Label-QJ7mfr_v.js";import"./useLabel-BoN1kqrs.js";import"./useLabels-B9A8JaNL.js";import"./number-gVXFFl9I.js";import"./useButton-C_sygl1c.js";import"./Menu-BkgF4e0R.js";import"./Autocomplete-QSoLsmg6.js";import"./useLoadMoreSentinel-CTkpujsH.js";import"./Input-Cw-knjtb.js";import"./ListBox-B_Wi1ZMb.js";import"./SelectionIndicator-B0WiXYe-.js";import"./Text-CcBkJcX0.js";import"./useListState-DfNyrXkH.js";import"./Dialog-Fw8yCkvG.js";import"./Heading-Dia6c8Ve.js";import"./useOverlayTriggerState-u57ke4k2.js";import"./VisuallyHidden-BP5VTP-I.js";import"./animation-rB_Nrf2Y.js";import"./SearchField-BXu4aPO1.js";import"./FieldError-BqVen_RV.js";import"./Form-Bo24afV9.js";import"./useFormValidation-CxDn_wUg.js";import"./useTextField-Drkqegd4.js";import"./useField-B0e6CrK8.js";import"./useFormReset-CIL9IUM3.js";import"./Virtualizer-C1udpvcD.js";import"./useFilter-BpAAqLEH.js";import"./getNodeText-COCAFKSu.js";import"./Link-BcGMghtF.js";import"./useResolvedHref-CvdgPikl.js";import"./Tooltip-Dd1GWXAA.js";import"./VisuallyHidden-BynRym6m.js";import"./Tabs-BYoZkzz0.js";import"./useHasTabbableChild-CXWmGR35.js";import"./BUIRoutingProvider-CMtIo0Uo.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
