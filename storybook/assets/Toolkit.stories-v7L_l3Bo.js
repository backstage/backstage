import{j as o}from"./iframe-BOS9XsSt.js";import{c as e}from"./plugin-wCQqv6mY.js";import{S as l}from"./Grid-DpJzwvsy.js";import{C as m}from"./ComponentAccordion-DEzHn1XD.js";import{w as a}from"./appWrappers-Bmoaw7n3.js";import{T as i}from"./TemplateBackstageLogoIcon-ClOMnXMB.js";import{I as s}from"./InfoCard-fL2e7Fb-.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BLgAY6cH.js";import"./componentData-5CzPqeYQ.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useApp-D9_f5DFp.js";import"./useRouteRef-D6pX7G_I.js";import"./index-BYPtPQ_E.js";import"./DialogTitle-DX7hGYAC.js";import"./Modal-B4EjrvcH.js";import"./Portal-CERNgFq6.js";import"./Backdrop-CpYmoctA.js";import"./Button-D34xgd1Q.js";import"./useObservable-DDhxjihL.js";import"./useIsomorphicLayoutEffect-CrKWISEl.js";import"./ExpandMore-DPjiSkKA.js";import"./AccordionDetails-CY60n5OB.js";import"./index-B9sM2jn7.js";import"./Collapse-CD_ND2rt.js";import"./useAsync-DzexZZOZ.js";import"./useMountedState-DaLgI8Ua.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BiZP4o13.js";import"./ErrorBoundary-Biou5a7y.js";import"./ErrorPanel-DvbxkBY0.js";import"./WarningPanel-DBRwILC2.js";import"./MarkdownContent-BPIFlL-y.js";import"./CodeSnippet-CVmjwtmC.js";import"./Box-BWfLAxjo.js";import"./styled-dnrl8B5-.js";import"./CopyTextButton-Bp4E28TJ.js";import"./useCopyToClipboard-hUj9jZ5o.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";import"./List-BHDOi6uW.js";import"./ListContext-a1j27SdY.js";import"./ListItem-D4jOCDNX.js";import"./ListItemText-BRz_C0D5.js";import"./LinkButton-Cfhz45Fp.js";import"./Link-B09CKdbR.js";import"./lodash-Czox7iJy.js";import"./CardHeader-CW0rLmly.js";import"./Divider-CxQHAU7C.js";import"./CardActions-DzUljMxl.js";import"./BottomLink-uXx83WET.js";import"./ArrowForward-DrsDRv_i.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
