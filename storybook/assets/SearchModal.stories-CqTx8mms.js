import{j as t,W as u,K as p,X as g}from"./iframe-C3xQ7KiW.js";import{r as h}from"./plugin-iw9Kjtp5.js";import{S as l,u as c,a as x}from"./useSearchModal-BgNad10L.js";import{s as S,M}from"./api-BgyOdvkL.js";import{S as C}from"./SearchContext-BESj-C2V.js";import{B as m}from"./Button-BdbB-Wt3.js";import{m as f}from"./makeStyles-DBmVe0pu.js";import{D as j,a as y,b as B}from"./DialogTitle-Dj7MlvG5.js";import{B as D}from"./Box-B9jbdd7x.js";import{S as n}from"./Grid-BxodhZCu.js";import{S as I}from"./SearchType-DSDb_cvc.js";import{L as G}from"./List-DDcVRd1X.js";import{H as R}from"./DefaultResultListItem-T7CnfS0Y.js";import{w as k}from"./appWrappers-DFplvtjt.js";import{SearchBar as v}from"./SearchBar-Csa0mmcc.js";import{S as T}from"./SearchResult-DCqrSEyH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CMDgLQS4.js";import"./Plugin-WfnU6DiB.js";import"./componentData-BL1V4mKI.js";import"./useAnalytics-DTGy5db2.js";import"./useApp-ZEXXdbdt.js";import"./useRouteRef-I8_DnC-Y.js";import"./index-DnV5JX1_.js";import"./ArrowForward-Cg6Vz5gh.js";import"./translation-ClRFlK9A.js";import"./Page-oA1UkbMk.js";import"./useMediaQuery-DQa69Nua.js";import"./Divider-DqGlWDd1.js";import"./ArrowBackIos-Bd27Kx70.js";import"./ArrowForwardIos-CWedWvVv.js";import"./translation-8RzHbvJe.js";import"./lodash-x848OuuT.js";import"./useAsync-DAqFgDP9.js";import"./useMountedState-VBi_CyPK.js";import"./Modal-DSjq774m.js";import"./Portal-CUj0vCdE.js";import"./Backdrop-BrkUV-DW.js";import"./styled-O7qqppix.js";import"./ExpandMore-DqWbQO0P.js";import"./AccordionDetails-D-n-z2wN.js";import"./index-B9sM2jn7.js";import"./Collapse-ByZrZAzU.js";import"./ListItem-SHU5LmI7.js";import"./ListContext-D0L7xoNS.js";import"./ListItemIcon-lmvZAht_.js";import"./ListItemText-DvpaBSJ3.js";import"./Tabs-D5eyGijZ.js";import"./KeyboardArrowRight-BPJSZ-Rt.js";import"./FormLabel-sFNTytUO.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CoZTazJd.js";import"./InputLabel-BOt3i3XK.js";import"./Select-CrbTe2CI.js";import"./Popover-CqlnqcmX.js";import"./MenuItem-rCI7_aV5.js";import"./Checkbox-DxbNw6s0.js";import"./SwitchBase-D3QVrUin.js";import"./Chip-BZojlWwe.js";import"./Link-Bn8sDEKN.js";import"./index-CiK-gQkJ.js";import"./useObservable-bbw4640I.js";import"./useIsomorphicLayoutEffect-nbzNF0jp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C_eJnPyL.js";import"./useDebounce-Bax_gwSH.js";import"./InputAdornment-CdQIzemb.js";import"./TextField-PExXhBVh.js";import"./useElementFilter-DICYDxKr.js";import"./EmptyState-u_xKezVV.js";import"./Progress-DGR3v5v3.js";import"./LinearProgress-DNoK0MTY.js";import"./ResponseErrorPanel-CrIhmAXu.js";import"./ErrorPanel-C01WicVM.js";import"./WarningPanel-CYlRhppO.js";import"./MarkdownContent-DOPwbL0a.js";import"./CodeSnippet-BTHBpHJq.js";import"./CopyTextButton-Daqccpqg.js";import"./useCopyToClipboard-Bc6jKzDS.js";import"./Tooltip-BZhLiA6X.js";import"./Popper-Bei7-2Ph.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
