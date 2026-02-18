import{j as t,W as u,K as p,X as g}from"./iframe-DHcBEgBH.js";import{r as h}from"./plugin-N0oWJLeH.js";import{S as l,u as c,a as x}from"./useSearchModal-kSLo5dv-.js";import{s as S,M}from"./api-C0xzS8jB.js";import{S as C}from"./SearchContext-CYSqSGHN.js";import{B as m}from"./Button-B0IAR49Q.js";import{m as f}from"./makeStyles-pGUaJr24.js";import{D as j,a as y,b as B}from"./DialogTitle-DwFThfhg.js";import{B as D}from"./Box-CbZQ1U2e.js";import{S as n}from"./Grid-BgyCT4VC.js";import{S as I}from"./SearchType-DQa8-6LB.js";import{L as G}from"./List-CzJs69wv.js";import{H as R}from"./DefaultResultListItem-DBW9QICy.js";import{w as k}from"./appWrappers-B-0EurdD.js";import{SearchBar as v}from"./SearchBar-DDDeRmuZ.js";import{S as T}from"./SearchResult-DYQBkkk2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CFbTF73j.js";import"./Plugin-DMdjcFYL.js";import"./componentData-WQbhBMG4.js";import"./useAnalytics-DzmCXJiR.js";import"./useApp-DfvXHod2.js";import"./useRouteRef-Coykz1i7.js";import"./index-CAQ8RYn7.js";import"./ArrowForward-DBEoeObG.js";import"./translation-JyalhL5f.js";import"./Page-DBFpgcyT.js";import"./useMediaQuery-BoXzlxKk.js";import"./Divider-Du8vAg9L.js";import"./ArrowBackIos-B8uU8De4.js";import"./ArrowForwardIos-61U9DhPd.js";import"./translation-DgECwdee.js";import"./lodash-BO6khM8p.js";import"./useAsync-Cocbz1wK.js";import"./useMountedState-f5Qy4kw8.js";import"./Modal-D6JI9uWD.js";import"./Portal-4pR_an9W.js";import"./Backdrop-BOdVHhMT.js";import"./styled-DMPIvYo_.js";import"./ExpandMore-acgofFN2.js";import"./AccordionDetails-79ol80ql.js";import"./index-B9sM2jn7.js";import"./Collapse-CvYPW26f.js";import"./ListItem-CTYXOgij.js";import"./ListContext-bUUGMd0s.js";import"./ListItemIcon-B6FYriHS.js";import"./ListItemText-Dm3_nGas.js";import"./Tabs-CHsVHDpA.js";import"./KeyboardArrowRight-D1qfzcfH.js";import"./FormLabel-CzXlMnOV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C4x-N1af.js";import"./InputLabel-DGNrG_ha.js";import"./Select-Bsf1NO_T.js";import"./Popover-DBNCOFt-.js";import"./MenuItem-C4EUiQPv.js";import"./Checkbox-Ce8tMBOL.js";import"./SwitchBase-lXDOIQBI.js";import"./Chip-z9xt1GeX.js";import"./Link-Bv9aCS_D.js";import"./index-OQeCNnW5.js";import"./useObservable-C1db0BVC.js";import"./useIsomorphicLayoutEffect-1W8t8JG8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BgOHpduo.js";import"./useDebounce-DzEqY11Z.js";import"./InputAdornment-BvU8_lqb.js";import"./TextField-DEAQ-7LP.js";import"./useElementFilter-RK0-ZjKK.js";import"./EmptyState-CT0GBUAT.js";import"./Progress-CVCT7h0B.js";import"./LinearProgress-CJv8Z-gK.js";import"./ResponseErrorPanel-Cv6zlDiw.js";import"./ErrorPanel-B1Su2HsZ.js";import"./WarningPanel-B8ubVF3r.js";import"./MarkdownContent-BFzMNVaX.js";import"./CodeSnippet-AhwYYrgB.js";import"./CopyTextButton-BWtlCBa4.js";import"./useCopyToClipboard-C3qsehrP.js";import"./Tooltip-8MUD-NVH.js";import"./Popper-Bsu9O5KR.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
