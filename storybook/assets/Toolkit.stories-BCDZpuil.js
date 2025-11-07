import{j as o}from"./iframe-C4yti0TH.js";import{c as e}from"./plugin-DzdQwfcL.js";import{S as l}from"./Grid-v0xxfd_1.js";import{C as m}from"./ComponentAccordion-B1OFng63.js";import{w as a}from"./appWrappers-CHKMDW6u.js";import{T as i}from"./TemplateBackstageLogoIcon-cMs47Nlk.js";import{I as s}from"./InfoCard-DPJdH_Et.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-IDIj0Vlw.js";import"./componentData-CnWfJ3h2.js";import"./useAnalytics--K1VOgoc.js";import"./useApp-y9Jc7IOk.js";import"./useRouteRef-HPBHqWqn.js";import"./index-B-o6asHV.js";import"./DialogTitle-N20emC9L.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./Backdrop-CvNyeuNu.js";import"./Button-CYNcmEzy.js";import"./useObservable-arzc73Pi.js";import"./useIsomorphicLayoutEffect-CzIfcLC5.js";import"./ExpandMore-C2bx2cGu.js";import"./AccordionDetails-DTv3HEFi.js";import"./index-DnL3XN75.js";import"./Collapse-BxjtCAeZ.js";import"./useAsync-D8arkYRP.js";import"./useMountedState-Cru6FRlT.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Bf4mW7o7.js";import"./ErrorBoundary-BzulBN0z.js";import"./ErrorPanel-EUwm2tRb.js";import"./WarningPanel-f4sgKJ3Y.js";import"./MarkdownContent-Dh73zjai.js";import"./CodeSnippet-C8zNOjQI.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./CopyTextButton-CW3FaXzD.js";import"./useCopyToClipboard-CdfTyMvr.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./ListItem-Cb_9Twd1.js";import"./ListItemText-BWf0pAiq.js";import"./LinkButton-C9QcjCSf.js";import"./Link-Cz9gaJJo.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CjUFrut6.js";import"./Divider-CU5IM_SK.js";import"./CardActions-ClCDbtfI.js";import"./BottomLink-Ds2ntytz.js";import"./ArrowForward-JohorMon.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
