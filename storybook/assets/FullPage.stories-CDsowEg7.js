import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-CSz7VfT3.js";import{P as l}from"./PluginHeader-TKlyralc.js";import{C as p}from"./Container-DtdFSWhE.js";import{T as t}from"./Text-Cq25VfyC.js";import{B as j}from"./BUIProvider-DlsqQjlV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ndNk04vF.js";import"./utils-DO510V5r.js";import"./useObjectRef-D_q6rl-C.js";import"./useCollection-BRMINt-w.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./Hidden-CM7FbOlL.js";import"./keyboard-Bg9gEdpU.js";import"./getMetaValue-C_A1bvat.js";import"./FocusScope-q3DFSEE5.js";import"./useEvent-B1v68yyd.js";import"./I18nProvider-C8LosUml.js";import"./usePress-BkOB3jXf.js";import"./textSelection-xDV9V9Np.js";import"./useControlledState-D9BG_cB_.js";import"./Link-DPbIwgnB.js";import"./useLink-BF9LE4Nv.js";import"./useHover-C4tPk2eu.js";import"./useLocalizedStringFormatter-C142jinZ.js";import"./Button-Be0Cy88V.js";import"./Label-AZq59z2_.js";import"./useLabel-B7GfVGDS.js";import"./useLabels-53H5tn1J.js";import"./number-vPK-eftY.js";import"./useButton-0UwCDxtn.js";import"./Menu-_rPBvSnO.js";import"./Autocomplete-__qsaNuQ.js";import"./useLoadMoreSentinel-D4Tl_mKJ.js";import"./Input-rX87b3KQ.js";import"./ListBox-zKNf2tM4.js";import"./SelectionIndicator-D0yCXn87.js";import"./Text-M5JE05Z1.js";import"./useListState-Bb8eRarH.js";import"./Dialog-rSqyM-23.js";import"./Heading-tcCPkFfK.js";import"./useOverlayTriggerState-BU4FYN95.js";import"./VisuallyHidden-BSkWTXCt.js";import"./animation-CNMihT0b.js";import"./SearchField-B0js2RMr.js";import"./FieldError-D30XUBdE.js";import"./Form-DCmzyXZg.js";import"./useFormValidation-BaS-Dz0q.js";import"./useTextField-B5NRQ6t7.js";import"./useField-CqcWBy83.js";import"./useFormReset-9iV2nQ5O.js";import"./Virtualizer-CnlLdrFa.js";import"./useFilter-CmszS9mf.js";import"./getNodeText-B5fQbWGz.js";import"./Link-nE-PIRQk.js";import"./useResolvedHref-Dnk2mOGG.js";import"./Tooltip-B6cAtNwx.js";import"./VisuallyHidden-TmsI0dah.js";import"./Tabs-C6yWD_DD.js";import"./useHasTabbableChild-BlfriEux.js";import"./BUIRoutingProvider-DWliD39c.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
