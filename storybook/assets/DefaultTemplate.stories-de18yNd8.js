import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BKfEGE7G.js";import{s as g,H as u}from"./plugin-_OgSNOg9.js";import{c as h}from"./api-Cnqdhpah.js";import{c as f}from"./catalogApiMock-B-jNwWNd.js";import{s as x}from"./api-DhH7lEZ9.js";import{S as y}from"./SearchContext-DpwNQLEm.js";import{P as S}from"./Page-Dv4eQxQD.js";import{S as r}from"./Grid-vX9qBbX0.js";import{b as k,a as j,c as C}from"./plugin-BOqA5qbY.js";import{T as P}from"./TemplateBackstageLogo-DHJsw7Xz.js";import{T}from"./TemplateBackstageLogoIcon-Dpknz8_Q.js";import{e as I}from"./routes-CJg4wSe3.js";import{w as v}from"./appWrappers-BhL0UeRU.js";import{s as G}from"./StarredEntitiesApi-DIe1XrPq.js";import{M as A}from"./MockStarredEntitiesApi-DzgMxpzK.js";import{I as B}from"./InfoCard-BPOeB8Dc.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Dwj1Q-YF.js";import"./Plugin-CmKCshsM.js";import"./componentData-MugjuQjt.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./useRouteRef-B__3vLRT.js";import"./index-DxVjIFhW.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DF0QzlTM.js";import"./useMountedState-Bzk_h1H1.js";import"./DialogTitle-COtGSIrZ.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./Backdrop-TvGNQn7O.js";import"./Button-CBt-BxVf.js";import"./useObservable-1flBwXTR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-DrXXBE5X.js";import"./ErrorBoundary-DggD4pwq.js";import"./ErrorPanel-D0Z-D0YB.js";import"./WarningPanel-BmLRnDjl.js";import"./ExpandMore-Bf4tz0ks.js";import"./AccordionDetails-DO5qN2es.js";import"./index-DnL3XN75.js";import"./Collapse-Bj6_bX8n.js";import"./MarkdownContent-BbcMZHtE.js";import"./CodeSnippet-4N0YB7qg.js";import"./Box-BJlQ2iQy.js";import"./styled-B4-rL4TL.js";import"./CopyTextButton-_rHychZO.js";import"./useCopyToClipboard-By-88AN1.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./ListItem-DH54cTxL.js";import"./ListItemText-DfnmZGrz.js";import"./LinkButton-Dp8nvFiv.js";import"./Link-CDMP9pev.js";import"./CardHeader-pOr2jc7f.js";import"./Divider-B7pMmKOl.js";import"./CardActions-D1j0vYEk.js";import"./BottomLink-DpbJPqBE.js";import"./ArrowForward-BWmuSl5e.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ut={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const Wt=["DefaultTemplate"];export{o as DefaultTemplate,Wt as __namedExportsOrder,Ut as default};
