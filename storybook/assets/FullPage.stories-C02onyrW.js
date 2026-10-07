import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-piw0-GWS.js";import{P as l}from"./PluginHeader-CzEvgfb7.js";import{C as p}from"./Container-DpXp_c7n.js";import{T as t}from"./Text-BtczWjb8.js";import{B as j}from"./BUIProvider-avY07MpV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Co7WXYIc.js";import"./utils-wuzg6Gut.js";import"./useObjectRef-IkhajRyJ.js";import"./useCollection-ClPqs5Wg.js";import"./useFocusRing-BpapEP6W.js";import"./openLink-BiQlZAwx.js";import"./Hidden-ChjLH5Dh.js";import"./keyboard-CxUCvJz3.js";import"./FocusScope-DEgH-NEq.js";import"./useEvent-BcEtlgIb.js";import"./I18nProvider-DMoCT0pg.js";import"./usePress-Bwx27jrs.js";import"./textSelection-eCd97__a.js";import"./useControlledState-WBvh0vQ5.js";import"./Link-D-WYMH_-.js";import"./useLink-aViEzP15.js";import"./useHover-CBlM-Gvk.js";import"./useLocalizedStringFormatter-BNjNGOHG.js";import"./Button-Cm250GNY.js";import"./Label-BZuUhWGV.js";import"./useLabel-ETY-Wxlf.js";import"./useLabels-BulSWJbq.js";import"./number-gEdanb4Y.js";import"./useButton-Cruw1eRB.js";import"./Menu-C1YeBdBU.js";import"./Autocomplete-Ci1mTh4c.js";import"./getItemCount-B2mBp9xv.js";import"./Input-DV5mrE8x.js";import"./ListBox-Cz2k-tzy.js";import"./Text-Dj98mrrm.js";import"./useListState-CjmLZ2hO.js";import"./Dialog-xhnks7ef.js";import"./Heading-DKJAsgjc.js";import"./useOverlayTriggerState-CkdldBFn.js";import"./VisuallyHidden-Ym6V1FKZ.js";import"./animation-BJ7i84cK.js";import"./SearchField-BrJjx7s0.js";import"./FieldError-C00vbv1H.js";import"./useFormValidation-CqX-gdFR.js";import"./useTextField-B4zMgAH5.js";import"./useField-BmyRXti8.js";import"./useFormReset-ByZK7tlo.js";import"./Virtualizer-CGEhGnb3.js";import"./useFilter-Blvverws.js";import"./getNodeText-Cu9OoIVL.js";import"./Link-C00Qsf7L.js";import"./useResolvedHref-RozAxOr0.js";import"./Tooltip-B2jaja2e.js";import"./VisuallyHidden-Dq7xkLMo.js";import"./Tabs-Dy2RfxMT.js";import"./useHasTabbableChild-s-ihfg79.js";import"./BUIRoutingProvider-DGNvCocA.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
