import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-M9O-K8SB.js";import{r as x}from"./plugin-BieVQ7iP.js";import{S as l,u as c,a as S}from"./useSearchModal-DQSTDEdW.js";import{s as M,M as C}from"./api-JIjLndcE.js";import{S as f}from"./SearchContext-3Ne9i5li.js";import{B as m}from"./Button-JPiqA3bT.js";import{D as j,a as y,b as B}from"./DialogTitle-BJV9GWqg.js";import{B as D}from"./Box-DrVgjJoD.js";import{S as n}from"./Grid-DxciBpqo.js";import{S as I}from"./SearchType-DjvLDprC.js";import{L as G}from"./List-DFXlWgcm.js";import{H as R}from"./DefaultResultListItem-Pm8pGhKu.js";import{w as k}from"./appWrappers-k5-JRCH3.js";import{SearchBar as v}from"./SearchBar-CK2mgHLs.js";import{S as T}from"./SearchResult-LLhtNGET.js";import"./preload-helper-PPVm8Dsz.js";import"./index-rR4Pt6og.js";import"./Plugin-CnPMefJ2.js";import"./componentData-lwFigNXQ.js";import"./useAnalytics-8ya555GT.js";import"./useApp-Citse85p.js";import"./useRouteRef-BuU8-jzQ.js";import"./index-CuiKZooy.js";import"./ArrowForward-DAkk1QjY.js";import"./translation-GT9F8gzi.js";import"./Page-ofKNp1l9.js";import"./useMediaQuery-BeVqOIt1.js";import"./Divider-O5bh-cJ-.js";import"./ArrowBackIos-DowBizyB.js";import"./ArrowForwardIos-8_88FHkt.js";import"./translation-kn3hcwTy.js";import"./lodash-Czox7iJy.js";import"./useAsync-CFnaQwpM.js";import"./useMountedState-CLl1ZXx0.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./Backdrop-D_SJu6io.js";import"./styled-Ddkk_tuK.js";import"./ExpandMore-BQg6NhWn.js";import"./AccordionDetails-C-b5rZIs.js";import"./index-B9sM2jn7.js";import"./Collapse-yN0IR1ZS.js";import"./ListItem-CccU-wMK.js";import"./ListContext-CQy2fJuy.js";import"./ListItemIcon-C0tJWs3p.js";import"./ListItemText-OpvVVx-v.js";import"./Tabs-Ckm9dnSY.js";import"./KeyboardArrowRight-O5ZDR88r.js";import"./FormLabel-CaD7F1Na.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnxnhVyN.js";import"./InputLabel-BRgQ3qkL.js";import"./Select-ByRkfEZ7.js";import"./Popover-9y8CeMZr.js";import"./MenuItem-Df6QXV-k.js";import"./Checkbox-DTbDgxgs.js";import"./SwitchBase-D1GSrS3W.js";import"./Chip-UMWnGD-v.js";import"./Link-Btc0GL0z.js";import"./useObservable-CuDF8Tct.js";import"./useIsomorphicLayoutEffect-9yTSWmeM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CDtZj0Ia.js";import"./useDebounce-CveqfYag.js";import"./InputAdornment-Bt63oMnw.js";import"./TextField-Dl4vLPoK.js";import"./useElementFilter-D-bjtJAi.js";import"./EmptyState-DYONb9PE.js";import"./Progress-Bmcn_mSX.js";import"./LinearProgress-CmfXhxAb.js";import"./ResponseErrorPanel-BcMIENty.js";import"./ErrorPanel-DmuSnSG8.js";import"./WarningPanel-BNg1npDI.js";import"./MarkdownContent-CYUmriLW.js";import"./CodeSnippet-BQZTwjqk.js";import"./CopyTextButton-D94RjEoK.js";import"./useCopyToClipboard-BSGGLx0n.js";import"./Tooltip-Bg-nqDOZ.js";import"./Popper-BxqJldSX.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
