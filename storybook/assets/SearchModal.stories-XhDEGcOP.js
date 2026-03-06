import{j as t,W as u,K as p,X as g}from"./iframe-Zkjja1CZ.js";import{r as h}from"./plugin-hYSiXeAX.js";import{S as l,u as c,a as x}from"./useSearchModal-CYAQzYaq.js";import{s as S,M}from"./api-C5lQ7G3H.js";import{S as C}from"./SearchContext-CMIvptHb.js";import{B as m}from"./Button-DKiV8u8_.js";import{m as f}from"./makeStyles-Dy9T_vRY.js";import{D as j,a as y,b as B}from"./DialogTitle-CZJlBXip.js";import{B as D}from"./Box-BMvVsAhI.js";import{S as n}from"./Grid-CmkVhak9.js";import{S as I}from"./SearchType-D5mgXCW4.js";import{L as G}from"./List-CDBWKecp.js";import{H as R}from"./DefaultResultListItem-DrveH4Sc.js";import{w as k}from"./appWrappers-DuG57F4M.js";import{SearchBar as v}from"./SearchBar-D3GkxVhK.js";import{S as T}from"./SearchResult-BVbmOYDR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D9SX4HWO.js";import"./Plugin-nqXV1SrL.js";import"./componentData-CICcICo0.js";import"./useAnalytics-C26DZv84.js";import"./useApp-DO9gHob0.js";import"./useRouteRef-DA0O_Sv2.js";import"./index-CR-oEA4Y.js";import"./ArrowForward-SRU6iMSn.js";import"./translation-W8Rut7_7.js";import"./Page-CdhjnvrV.js";import"./useMediaQuery-D7pcoSwO.js";import"./Divider-CQnbFZ8k.js";import"./ArrowBackIos-DfizOZj7.js";import"./ArrowForwardIos-SLkGWXuq.js";import"./translation-BUF4xWqF.js";import"./lodash-psU78ChZ.js";import"./useAsync-C_WVJ2PX.js";import"./useMountedState-D9kI3ita.js";import"./Modal-VTjU7VJ1.js";import"./Portal-BlfvlNo0.js";import"./Backdrop-CTvDiGEP.js";import"./styled-BgXxje-f.js";import"./ExpandMore-DJWeiOFB.js";import"./AccordionDetails-COvZRTzy.js";import"./index-B9sM2jn7.js";import"./Collapse-By5xx0Hx.js";import"./ListItem-WvMtEKfL.js";import"./ListContext-R-tftgRd.js";import"./ListItemIcon-BxiPCdbw.js";import"./ListItemText-CBfYDWFP.js";import"./Tabs-CjeOUeqj.js";import"./KeyboardArrowRight-Cr0eZDF8.js";import"./FormLabel-BMl4daxA.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-xfRDKPcD.js";import"./InputLabel-Cqcv9tFv.js";import"./Select-ho_Ug-C7.js";import"./Popover-DiWYzlET.js";import"./MenuItem-BixMD-da.js";import"./Checkbox-H0ooQkbY.js";import"./SwitchBase-C_sNQ6iG.js";import"./Chip-jci56BaY.js";import"./Link-BGdkHKdy.js";import"./index-CHk62GMG.js";import"./useObservable-BSTD_mAX.js";import"./useIsomorphicLayoutEffect-BlbNJNPC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B_Rcd0vD.js";import"./useDebounce-BLZhbraH.js";import"./InputAdornment-BLEJ3ZW3.js";import"./TextField-DenT3LV_.js";import"./useElementFilter-DEgGhw3l.js";import"./EmptyState-1z_m_cKs.js";import"./Progress-D3iAINP3.js";import"./LinearProgress-BBLtxe93.js";import"./ResponseErrorPanel-pBMdn2Vn.js";import"./ErrorPanel-DXPEEABK.js";import"./WarningPanel-SonS1I9E.js";import"./MarkdownContent-B3IgYOVG.js";import"./CodeSnippet-DPrivACZ.js";import"./CopyTextButton-D6itQlND.js";import"./useCopyToClipboard-DGD3nvhE.js";import"./Tooltip-9gNW0pGl.js";import"./Popper-HBCr7d9w.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
