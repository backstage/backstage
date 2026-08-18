import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-Bfeun6FV.js";import{P as l}from"./PluginHeader-CkWQTk-6.js";import{C as p}from"./Container-BOw4UUTK.js";import{T as t}from"./Text-Cgoj6p6V.js";import{B as j}from"./BUIProvider-B3JZ5_CR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CVNQhIDx.js";import"./utils-C1fACjU5.js";import"./useObjectRef-DpvjfcTN.js";import"./useCollection-DeX7otQ8.js";import"./useFocusRing-D2D9w2h7.js";import"./openLink-Z9FeXa0N.js";import"./Hidden-sFV-2aQN.js";import"./keyboard-BTOl7xVT.js";import"./FocusScope-Bv6PArKX.js";import"./useEvent-vC-ysoRO.js";import"./I18nProvider-TylybwwN.js";import"./usePress-TbacPce5.js";import"./textSelection-DZyb17vv.js";import"./useControlledState-CC8JDBnw.js";import"./Link-C6OtGdpE.js";import"./useLink-aS6vWmzD.js";import"./useHover-Bl99Bvws.js";import"./useLocalizedStringFormatter-D_4gFDnf.js";import"./Button-CXBJEZu8.js";import"./Label-CMwfur8h.js";import"./useLabel-fE5WpueX.js";import"./useLabels-ClA9bczX.js";import"./number-3AeMSo45.js";import"./useButton-35EaW1qC.js";import"./Menu-DEicnal5.js";import"./Autocomplete-DZ5iwN9X.js";import"./getItemCount-C_eYKaFf.js";import"./Input-D48E8LcP.js";import"./ListBox-D-ejC2JJ.js";import"./Text-DOL3ix9A.js";import"./useListState-EmLhgg1p.js";import"./Dialog-CRthzS2b.js";import"./Heading-BcnG0VjG.js";import"./useOverlayTriggerState-DF5r881j.js";import"./VisuallyHidden-CtLKqaVY.js";import"./animation-DPrX5Bmr.js";import"./SearchField-CBhic2oo.js";import"./FieldError-BWjgqGMr.js";import"./useFormValidation-BCBDK8Qf.js";import"./useTextField-h-cI21RN.js";import"./useField-BxvGjrCe.js";import"./useFormReset-DCGdCl6y.js";import"./Virtualizer-D0G2ErKL.js";import"./useFilter-MUPmUk7G.js";import"./getNodeText-CEzbLUrP.js";import"./Link-DpJxa_fz.js";import"./useResolvedHref-C1ukixa2.js";import"./Tooltip-BAHNPtWJ.js";import"./VisuallyHidden-CObAhBM3.js";import"./Tabs-D9ynpCun.js";import"./useHasTabbableChild-CC7bVvAe.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
