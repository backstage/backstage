import{j as t,W as u,K as p,X as g}from"./iframe-y42y8Oej.js";import{r as h}from"./plugin-C7C8k4OC.js";import{S as l,u as c,a as x}from"./useSearchModal-DqM4kiP6.js";import{s as S,M}from"./api-Cd86LpCz.js";import{S as C}from"./SearchContext-CVxjAZbe.js";import{B as m}from"./Button-CMiQpMRS.js";import{m as f}from"./makeStyles-DJdTRUmQ.js";import{D as j,a as y,b as B}from"./DialogTitle-C57ssYr3.js";import{B as D}from"./Box-C7hZLEtJ.js";import{S as n}from"./Grid-CqRlAN7B.js";import{S as I}from"./SearchType-BiDvYlOu.js";import{L as G}from"./List-DO_c5BbT.js";import{H as R}from"./DefaultResultListItem-D_HMMALA.js";import{w as k}from"./appWrappers-CTk5_NGt.js";import{SearchBar as v}from"./SearchBar-B94JbOwp.js";import{S as T}from"./SearchResult-CaaAEWYh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BQtUyS7N.js";import"./Plugin-DWH2Tq9_.js";import"./componentData-k6HFTu6d.js";import"./useAnalytics-DWWuFwoK.js";import"./useApp-jjPu4N5T.js";import"./useRouteRef-ChhuI2XU.js";import"./index-CKnVRbVy.js";import"./ArrowForward-BpZ5l35F.js";import"./translation-C-MPyyGp.js";import"./Page-Be0SepV6.js";import"./useMediaQuery-C9osTrLA.js";import"./Divider-BhEceQA0.js";import"./ArrowBackIos-VCLSnLNm.js";import"./ArrowForwardIos-CewaK51G.js";import"./translation-BFkvXnN2.js";import"./lodash-D9X_jrAn.js";import"./useAsync-czSD0GXf.js";import"./useMountedState-DUaJLf6X.js";import"./Modal-CUqNDlSg.js";import"./Portal-mSXpCt2p.js";import"./Backdrop-CTbxXnKE.js";import"./styled-CM7DeKVT.js";import"./ExpandMore-BHDyeZqq.js";import"./AccordionDetails-7Fb7C26_.js";import"./index-B9sM2jn7.js";import"./Collapse-DFtdJCo5.js";import"./ListItem-C9CmSeWD.js";import"./ListContext-Cbd93-g4.js";import"./ListItemIcon-CmlcIVyv.js";import"./ListItemText-bJqslP2h.js";import"./Tabs-RxCe7U17.js";import"./KeyboardArrowRight-rTKcAeAR.js";import"./FormLabel-C_fU4WR7.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CRISQwwQ.js";import"./InputLabel-BzSWkUyM.js";import"./Select-CuRc_rMa.js";import"./Popover-DFNyBgpP.js";import"./MenuItem-CZnspt84.js";import"./Checkbox-DS9-7tha.js";import"./SwitchBase-DvGJtWDt.js";import"./Chip-D_TmlZSJ.js";import"./Link-Cx85Eufs.js";import"./index-YOnDx3vl.js";import"./useObservable-CCY3P9ZA.js";import"./useIsomorphicLayoutEffect-BYxM_07h.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CnPunAmK.js";import"./useDebounce-uMUPV5wp.js";import"./InputAdornment-BWkJ_0sv.js";import"./TextField-Ck2qYEGu.js";import"./useElementFilter-CRD_KQF2.js";import"./EmptyState-jpWg0nfz.js";import"./Progress-SAAmRodP.js";import"./LinearProgress-BbXOfquf.js";import"./ResponseErrorPanel-hBXI5IJ7.js";import"./ErrorPanel-Vmv2e2jh.js";import"./WarningPanel-B8f7_bz_.js";import"./MarkdownContent-C_ct0HRg.js";import"./CodeSnippet-ErvL8mI9.js";import"./CopyTextButton-CYnCjE6P.js";import"./useCopyToClipboard-CjN5pxJ0.js";import"./Tooltip-BNLu37bx.js";import"./Popper-BWCVR11Y.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
